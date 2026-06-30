from pathlib import Path
import shutil, re, sys

ROOT = Path.cwd()
HTML = ROOT / 'fortis.html'
JS = ROOT / 'js' / 'fortis.js'
OUT = ROOT / 'js' / 'calculadora.js'
BACK = ROOT / 'backup-sprint14-calculadora'

FUNCS = ['getVals', 'calc']


def fail(msg):
    print('ERRO:', msg)
    sys.exit(1)


def find_function(src, name):
    m = re.search(r'(^|\n)function\s+' + re.escape(name) + r'\s*\(', src)
    if not m:
        return None
    start = m.start(0) + (1 if src[m.start(0)] == '\n' else 0)
    brace = src.find('{', m.end())
    if brace == -1:
        fail(f'função {name} sem abertura {{')
    depth = 0
    i = brace
    in_s = in_d = in_t = False
    esc = False
    line = block = False
    while i < len(src):
        ch = src[i]
        nxt = src[i+1] if i+1 < len(src) else ''
        if line:
            if ch == '\n': line = False
        elif block:
            if ch == '*' and nxt == '/':
                block = False; i += 1
        elif in_s:
            if esc: esc = False
            elif ch == '\\': esc = True
            elif ch == "'": in_s = False
        elif in_d:
            if esc: esc = False
            elif ch == '\\': esc = True
            elif ch == '"': in_d = False
        elif in_t:
            if esc: esc = False
            elif ch == '\\': esc = True
            elif ch == '`': in_t = False
        else:
            if ch == '/' and nxt == '/': line = True; i += 1
            elif ch == '/' and nxt == '*': block = True; i += 1
            elif ch == "'": in_s = True
            elif ch == '"': in_d = True
            elif ch == '`': in_t = True
            elif ch == '{': depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    while end < len(src) and src[end] in ' \t\r\n':
                        end += 1
                    return start, end, src[start:end]
        i += 1
    fail(f'não achei fim da função {name}')


def ensure_script(html, src, before='js/fortis.js'):
    tag = f'<script src="{src}"></script>'
    if src in html:
        return html
    pat = re.compile(r'<script\s+src=["\']' + re.escape(before) + r'["\']\s*>\s*</script>')
    m = pat.search(html)
    if not m:
        fail(f'não encontrei script {before} no fortis.html')
    return html[:m.start()] + tag + '\n' + html[m.start():]

if not HTML.exists(): fail('fortis.html não encontrado')
if not JS.exists(): fail('js/fortis.js não encontrado')

src = JS.read_text(encoding='utf-8')
if OUT.exists() and 'function calc(' in OUT.read_text(encoding='utf-8', errors='ignore'):
    fail('js/calculadora.js já parece conter calc(). Sprint já aplicada?')

found = []
for fn in FUNCS:
    res = find_function(src, fn)
    if not res:
        fail(f'função {fn} não encontrada em js/fortis.js')
    found.append((fn, *res))

BACK.mkdir(exist_ok=True)
shutil.copy2(HTML, BACK / 'fortis.html')
shutil.copy2(JS, BACK / 'fortis.js')
if OUT.exists(): shutil.copy2(OUT, BACK / 'calculadora.js')

# remove de trás para frente para preservar índices
new_src = src
for fn, start, end, code in sorted(found, key=lambda x: x[1], reverse=True):
    new_src = new_src[:start] + new_src[end:]

header = """/* ══════════════════════════════════════════\n   FORTIS — Calculadora\n   Sprint 14: getVals() e calc() movidos de fortis.js\n   Lógica preservada.\n══════════════════════════════════════════ */\n\n"""
body = '\n\n'.join(code.strip() for fn, start, end, code in found) + '\n'
OUT.write_text(header + body, encoding='utf-8')
JS.write_text(new_src, encoding='utf-8')

html = HTML.read_text(encoding='utf-8')
html = ensure_script(html, 'js/calculadora.js')
HTML.write_text(html, encoding='utf-8')

# validações simples
html2 = HTML.read_text(encoding='utf-8')
js2 = JS.read_text(encoding='utf-8')
out2 = OUT.read_text(encoding='utf-8')
checks = [
    ('js/calculadora.js criado', OUT.exists()),
    ('calc() movido para calculadora.js', 'function calc(' in out2),
    ('getVals() movido para calculadora.js', 'function getVals(' in out2),
    ('calc() removido do fortis.js', 'function calc(' not in js2),
    ('getVals() removido do fortis.js', 'function getVals(' not in js2),
    ('fortis.html carrega calculadora.js', 'js/calculadora.js' in html2),
    ('fortis.html ainda carrega fortis.js', 'js/fortis.js' in html2),
]
print('Sprint 14 concluída.')
print('Backup criado em:', BACK)
print('Validações:')
ok = True
for name, passed in checks:
    print(' -', name + ':', 'OK' if passed else 'FALHOU')
    ok = ok and passed
if not ok:
    print('\nAlgo falhou. Para voltar:')
    print('git restore fortis.html js/fortis.js')
    print('del js\\calculadora.js')
    sys.exit(1)
