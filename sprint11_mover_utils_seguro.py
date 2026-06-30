from pathlib import Path
import shutil

ROOT = Path.cwd()
HTML = ROOT / 'fortis.html'
JS_DIR = ROOT / 'js'
FORTIS = JS_DIR / 'fortis.js'
UTILS = JS_DIR / 'utils.js'
BACKUP = ROOT / 'backup-sprint11'

UTILS_START = '/* ─── UTILS ─── */'
NEXT_MARKER = '/* ─── CUSTO MP DA ENGENHARIA ─── */'
UTIL_FUNCS = ['fmt(', 'fp(', 'fR(', 'S(', 'SC(', 'uid(', 'addD(', 'dstr(', 'setBar(']


def fail(msg):
    print('ERRO:', msg)
    raise SystemExit(1)

if not HTML.exists():
    fail('fortis.html não encontrado nesta pasta.')
if not FORTIS.exists():
    fail('js/fortis.js não encontrado nesta pasta.')

js = FORTIS.read_text(encoding='utf-8')
html = HTML.read_text(encoding='utf-8')

if UTILS.exists() and 'function fmt' in UTILS.read_text(encoding='utf-8', errors='ignore'):
    fail('js/utils.js já existe com funções. Sprint 11 parece já aplicada.')

if UTILS_START not in js:
    fail('bloco UTILS não encontrado em js/fortis.js.')
if NEXT_MARKER not in js:
    fail('marcador seguinte do bloco UTILS não encontrado.')

start = js.index(UTILS_START)
end = js.index(NEXT_MARKER, start)
utils_block = js[start:end].rstrip() + '\n'
new_js = js[:start] + NEXT_MARKER + js[end + len(NEXT_MARKER):]

# valida que pegou as funções certas
for sig in ['function fmt', 'function fp', 'function fR', 'function S', 'function SC', 'function uid', 'function addD', 'function dstr', 'function setBar']:
    if sig not in utils_block:
        fail(f'função esperada não encontrada no bloco extraído: {sig}')

BACKUP.mkdir(exist_ok=True)
shutil.copy2(HTML, BACKUP / 'fortis.html')
shutil.copy2(FORTIS, BACKUP / 'fortis.js')

UTILS.write_text(utils_block, encoding='utf-8')
FORTIS.write_text(new_js, encoding='utf-8')

# inserir utils.js antes de fortis.js no HTML, mantendo script clássico
if 'js/utils.js' not in html:
    candidates = [
        '<script src="js/fortis.js"></script>',
        "<script src='js/fortis.js'></script>",
        '<script type="module" src="js/fortis.js"></script>',
        "<script type='module' src='js/fortis.js'></script>",
    ]
    replaced = False
    for c in candidates:
        if c in html:
            if 'type="module"' in c or "type='module'" in c:
                fail('fortis.html ainda está usando type="module". Volte para a Sprint 9/10 segura antes de continuar.')
            html = html.replace(c, '<script src="js/utils.js"></script>\n  ' + c, 1)
            replaced = True
            break
    if not replaced:
        fail('não encontrei <script src="js/fortis.js"></script> no fortis.html.')
    HTML.write_text(html, encoding='utf-8')

# validações finais
html2 = HTML.read_text(encoding='utf-8')
js2 = FORTIS.read_text(encoding='utf-8')
ut2 = UTILS.read_text(encoding='utf-8')

checks = []
checks.append(('HTML carrega js/utils.js antes de js/fortis.js', html2.find('js/utils.js') != -1 and html2.find('js/utils.js') < html2.find('js/fortis.js')))
checks.append(('js/utils.js criado', UTILS.exists()))
checks.append(('calc() preservada em js/fortis.js', 'function calc()' in js2))
checks.append(('backupDB() preservada em js/fortis.js', 'function backupDB()' in js2))
checks.append(('restoreDB() preservada em js/fortis.js', 'function restoreDB()' in js2))
checks.append(('fmt() movida para js/utils.js', 'function fmt' in ut2))
checks.append(('setBar() movida para js/utils.js', 'function setBar' in ut2))
checks.append(('fmt() removida de js/fortis.js', 'function fmt' not in js2))

bad = [name for name, ok in checks if not ok]
if bad:
    for name, ok in checks:
        print(('- ' if ok else '- FALHOU: ') + name)
    fail('validação final falhou.')

print('Sprint 11 concluída.')
print('Backup criado em: backup-sprint11')
print('Arquivo criado: js/utils.js')
print('Atualizado: fortis.html')
print('Atualizado: js/fortis.js')
print('Validações:')
for name, ok in checks:
    print(' - ' + name + ': OK')
