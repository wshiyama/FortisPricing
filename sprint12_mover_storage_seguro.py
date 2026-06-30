from pathlib import Path
import shutil

ROOT = Path.cwd()
HTML = ROOT / 'fortis.html'
JS_DIR = ROOT / 'js'
FORTIS = JS_DIR / 'fortis.js'
STORAGE = JS_DIR / 'storage.js'
BACKUP = ROOT / 'backup-sprint12'

START = '/* ─── BANCO ─── */'
NEXT = '/* ─── AUTONOME: preenche nome ao digitar senha ─── */'
EXPECTED = [
    'function loadDB',
    'function saveDB',
    'function deleteDB',
    'function clearDB',
    'function renderDB',
    'function exportCSV',
]

def fail(msg):
    print('ERRO:', msg)
    raise SystemExit(1)

if not HTML.exists():
    fail('fortis.html não encontrado nesta pasta.')
if not FORTIS.exists():
    fail('js/fortis.js não encontrado nesta pasta.')

js = FORTIS.read_text(encoding='utf-8')
html = HTML.read_text(encoding='utf-8')

if STORAGE.exists() and 'function loadDB' in STORAGE.read_text(encoding='utf-8', errors='ignore'):
    fail('js/storage.js já existe com funções. Sprint 12 parece já aplicada.')

if START not in js:
    fail('bloco BANCO não encontrado em js/fortis.js.')
if NEXT not in js:
    fail('marcador AUTONOME não encontrado em js/fortis.js.')

start = js.index(START)
end = js.index(NEXT, start)
storage_block = js[start:end].rstrip() + '\n'
new_js = js[:start] + NEXT + js[end + len(NEXT):]

for sig in EXPECTED:
    if sig not in storage_block:
        fail(f'função esperada não encontrada no bloco extraído: {sig}')

BACKUP.mkdir(exist_ok=True)
shutil.copy2(HTML, BACKUP / 'fortis.html')
shutil.copy2(FORTIS, BACKUP / 'fortis.js')
if STORAGE.exists():
    shutil.copy2(STORAGE, BACKUP / 'storage.js')

STORAGE.write_text(storage_block, encoding='utf-8')
FORTIS.write_text(new_js, encoding='utf-8')

# inserir storage.js antes de fortis.js, depois de utils.js se existir
if 'js/storage.js' not in html:
    target = '<script src="js/fortis.js"></script>'
    target2 = "<script src='js/fortis.js'></script>"
    if target in html:
        html = html.replace(target, '<script src="js/storage.js"></script>\n  ' + target, 1)
    elif target2 in html:
        html = html.replace(target2, "<script src='js/storage.js'></script>\n  " + target2, 1)
    else:
        fail('não encontrei <script src="js/fortis.js"></script> no fortis.html.')
    HTML.write_text(html, encoding='utf-8')

html2 = HTML.read_text(encoding='utf-8')
js2 = FORTIS.read_text(encoding='utf-8')
st2 = STORAGE.read_text(encoding='utf-8')

checks = []
checks.append(('HTML carrega js/storage.js antes de js/fortis.js', html2.find('js/storage.js') != -1 and html2.find('js/storage.js') < html2.find('js/fortis.js')))
checks.append(('js/storage.js criado', STORAGE.exists()))
checks.append(('loadDB() movida para js/storage.js', 'function loadDB' in st2))
checks.append(('saveDB() movida para js/storage.js', 'function saveDB' in st2))
checks.append(('renderDB() movida para js/storage.js', 'function renderDB' in st2))
checks.append(('exportCSV() movida para js/storage.js', 'function exportCSV' in st2))
checks.append(('loadDB() removida de js/fortis.js', 'function loadDB' not in js2))
checks.append(('calc() preservada em js/fortis.js', 'function calc()' in js2))
checks.append(('backupDB() preservada em js/fortis.js', 'function backupDB()' in js2))
checks.append(('restoreDB() preservada em js/fortis.js', 'function restoreDB()' in js2))

bad = [name for name, ok in checks if not ok]
if bad:
    for name, ok in checks:
        print((' - ' if ok else ' - FALHOU: ') + name)
    fail('validação final falhou.')

print('Sprint 12 concluída.')
print('Backup criado em: backup-sprint12')
print('Arquivo criado: js/storage.js')
print('Atualizado: fortis.html')
print('Atualizado: js/fortis.js')
print('Validações:')
for name, ok in checks:
    print(' - ' + name + ': OK')
