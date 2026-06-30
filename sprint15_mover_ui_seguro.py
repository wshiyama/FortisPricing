from pathlib import Path
import shutil, re, sys

ROOT = Path.cwd()
FORTIS = ROOT / 'js' / 'fortis.js'
HTML = ROOT / 'fortis.html'
UI = ROOT / 'js' / 'ui.js'
BACKUP = ROOT / 'backup-sprint15-ui'

FUNCS = [
    'renderMPEditor',
    'setMode',
    'setSTab',
    'onProdChange',
    'setF',
    'updMg',
    'renderPZ',
]

def fail(msg):
    print('ERRO:', msg)
    sys.exit(1)

def find_function(src, name):
    pat = re.compile(r'function\s+' + re.escape(name) + r'\s*\([^)]*\)\s*\{')
    m = pat.search(src)
    if not m:
        return None
    i = m.start()
    j = m.end() - 1
    depth = 0
    in_str = None
    esc = False
    in_line = False
    in_block = False
    for k in range(j, len(src)):
        ch = src[k]
        nxt = src[k+1] if k+1 < len(src) else ''
        if in_line:
            if ch == '\n': in_line = False
            continue
        if in_block:
            if ch == '*' and nxt == '/': in_block = False
            continue
        if in_str:
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == in_str:
                in_str = None
            continue
        if ch == '/' and nxt == '/':
            in_line = True; continue
        if ch == '/' and nxt == '*':
            in_block = True; continue
        if ch in ('"', "'", '`'):
            in_str = ch; continue
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                end = k + 1
                while end < len(src) and src[end] in ' \t\r\n;':
                    if src[end] == ';':
                        end += 1
                        break
                    end += 1
                return (i, end, src[i:end].strip())
    return None

def ensure_script(html):
    if 'js/ui.js' in html:
        return html
    tag = '<script src="js/ui.js"></script>'
    # coloca antes do fortis.js para manter funções globais disponíveis
    patterns = [
        r'<script\s+src=["\']js/fortis\.js["\']\s*>\s*</script>',
        r'<script\s+src=["\']\.\/js/fortis\.js["\']\s*>\s*</script>',
    ]
    for p in patterns:
        m = re.search(p, html)
        if m:
            return html[:m.start()] + tag + '\n' + html[m.start():]
    fail('tag <script src="js/fortis.js"></script> não encontrada no fortis.html')

if not FORTIS.exists(): fail('js/fortis.js não encontrado')
if not HTML.exists(): fail('fortis.html não encontrado')

src = FORTIS.read_text(encoding='utf-8')
html = HTML.read_text(encoding='utf-8')

# Se já aplicado, não reaplica.
if UI.exists() and all(('function '+f) in UI.read_text(encoding='utf-8') for f in FUNCS):
    print('Sprint 15 já parece aplicada. Nada a fazer.')
    sys.exit(0)

found = []
missing = []
for f in FUNCS:
    res = find_function(src, f)
    if res:
        found.append((f, res))
    else:
        missing.append(f)

# Segurança: precisa achar pelo menos as funções principais de tela.
required = {'setMode','setSTab','onProdChange','setF','updMg','renderPZ'}
miss_req = required.intersection(missing)
if miss_req:
    fail('funções obrigatórias não encontradas em js/fortis.js: ' + ', '.join(sorted(miss_req)))

BACKUP.mkdir(exist_ok=True)
shutil.copy2(FORTIS, BACKUP / 'fortis.js')
shutil.copy2(HTML, BACKUP / 'fortis.html')
if UI.exists(): shutil.copy2(UI, BACKUP / 'ui.js')

# remove de trás para frente
new_src = src
for f, (start, end, code) in sorted(found, key=lambda x: x[1][0], reverse=True):
    new_src = new_src[:start] + new_src[end:]

ui_code = """/* ══════════════════════════════════════════\n   FORTIS — UI e navegação\n   Extraído do fortis.js sem alterar lógica\n══════════════════════════════════════════ */\n\n"""
ui_code += '\n\n'.join(code for f, (start, end, code) in found)
ui_code += '\n'

UI.write_text(ui_code, encoding='utf-8')
FORTIS.write_text(new_src, encoding='utf-8')
HTML.write_text(ensure_script(html), encoding='utf-8')

# Validações simples
fortis_after = FORTIS.read_text(encoding='utf-8')
ui_after = UI.read_text(encoding='utf-8')
html_after = HTML.read_text(encoding='utf-8')
errors = []
for f, _ in found:
    if ('function '+f) not in ui_after:
        errors.append(f'{f} não entrou em js/ui.js')
    if ('function '+f) in fortis_after:
        errors.append(f'{f} ainda aparece em js/fortis.js')
if 'js/ui.js' not in html_after:
    errors.append('fortis.html não referencia js/ui.js')
if errors:
    shutil.copy2(BACKUP / 'fortis.js', FORTIS)
    shutil.copy2(BACKUP / 'fortis.html', HTML)
    fail('validação falhou: ' + '; '.join(errors))

print('Sprint 15 concluída.')
print('Backup criado em:', BACKUP)
print('JS criado:', UI)
print('Funções movidas:', ', '.join(f for f, _ in found))
if missing:
    print('Funções não encontradas e ignoradas:', ', '.join(missing))
print('Validações: OK')
