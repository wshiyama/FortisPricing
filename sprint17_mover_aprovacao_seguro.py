from pathlib import Path
import shutil, re, sys

ROOT = Path.cwd()
FORTIS = ROOT / 'js' / 'fortis.js'
HTML = ROOT / 'fortis.html'
APROV = ROOT / 'js' / 'aprovacao.js'
BACKUP = ROOT / 'backup-sprint17'

if not FORTIS.exists():
    raise SystemExit('ERRO: js/fortis.js não encontrado. Rode na raiz do projeto FortisPricing.')

BACKUP.mkdir(exist_ok=True)
shutil.copy2(FORTIS, BACKUP / 'fortis.js')
if HTML.exists():
    shutil.copy2(HTML, BACKUP / 'fortis.html')

src = FORTIS.read_text(encoding='utf-8')

funcs = ['openSend','doSend','openAprov','doAprov','openRepr','doRepr','closeOv','autoNome','autenticar']
extracted = []

def extract_function(text, name):
    # function name(args){...} with balanced braces
    m = re.search(r'function\s+' + re.escape(name) + r'\s*\([^)]*\)\s*\{', text)
    if not m:
        return text, None
    start = m.start()
    i = m.end() - 1
    depth = 0
    in_str = None
    esc = False
    for j in range(i, len(text)):
        ch = text[j]
        if in_str:
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == in_str:
                in_str = None
        else:
            if ch in ('"', "'", '`'):
                in_str = ch
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    end = j + 1
                    # consume trailing whitespace/newlines
                    while end < len(text) and text[end] in ' \t\r\n':
                        end += 1
                    return text[:start] + text[end:], text[start:j+1].strip()
    return text, None

for fn in funcs:
    src, block = extract_function(src, fn)
    if block:
        extracted.append(block)

if not extracted:
    raise SystemExit('ERRO: nenhuma função de aprovação encontrada. Nada foi alterado.')

APROV.write_text('/* Sprint 17 — Aprovação / modais\n   Movido de fortis.js sem alteração de lógica. */\n\n' + '\n\n'.join(extracted) + '\n', encoding='utf-8')
FORTIS.write_text(src, encoding='utf-8')

# insert script in fortis.html before fortis.js, classic script, only if not present
if HTML.exists():
    html = HTML.read_text(encoding='utf-8')
    if 'js/aprovacao.js' not in html:
        html2 = html.replace('<script src="js/fortis.js"></script>', '<script src="js/aprovacao.js"></script>\n  <script src="js/fortis.js"></script>')
        html2 = html2.replace("<script src='js/fortis.js'></script>", "<script src='js/aprovacao.js'></script>\n  <script src='js/fortis.js'></script>")
        if html2 == html:
            # fallback: put before body end
            html2 = html.replace('</body>', '  <script src="js/aprovacao.js"></script>\n</body>')
        HTML.write_text(html2, encoding='utf-8')

# validations
ap = APROV.read_text(encoding='utf-8')
for required in ['function openSend', 'function doAprov', 'function closeOv']:
    if required not in ap:
        print('AVISO:', required, 'não encontrado em js/aprovacao.js')

print('Sprint 17 concluída.')
print('Criado: js/aprovacao.js')
print('Backup: backup-sprint17/')
print('Teste: enviar para aprovação, aprovar, reprovar, banco e relatório.')
