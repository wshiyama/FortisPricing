from pathlib import Path
import shutil, re, sys

ROOT = Path.cwd()
HTML = ROOT / 'fortis.html'
JS = ROOT / 'js' / 'fortis.js'
ENG_JS = ROOT / 'js' / 'engenharia.js'
BACKUP = ROOT / 'backup-sprint13-engenharia'


def fail(msg):
    print('ERRO:', msg)
    sys.exit(1)


def find_block_var(src, name):
    m = re.search(r'(^|\n)\s*var\s+' + re.escape(name) + r'\s*=\s*\{', src)
    if not m:
        fail(f'var {name} não encontrado em js/fortis.js')
    start = m.start() + (1 if src[m.start()] == '\n' else 0)
    brace = src.find('{', m.start())
    depth = 0
    in_str = None
    esc = False
    i = brace
    while i < len(src):
        ch = src[i]
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
                    semi = src.find(';', i)
                    if semi == -1:
                        fail(f'ponto e vírgula final de var {name} não encontrado')
                    end = semi + 1
                    while end < len(src) and src[end] in ' \t\r\n':
                        end += 1
                    return start, end, src[start:end]
        i += 1
    fail(f'fim do bloco var {name} não encontrado')


def find_func(src, name):
    m = re.search(r'(^|\n)\s*function\s+' + re.escape(name) + r'\s*\(', src)
    if not m:
        fail(f'function {name} não encontrada em js/fortis.js')
    start = m.start() + (1 if src[m.start()] == '\n' else 0)
    brace = src.find('{', m.end())
    depth = 0
    in_str = None
    esc = False
    i = brace
    while i < len(src):
        ch = src[i]
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
                    end = i + 1
                    while end < len(src) and src[end] in ' \t\r\n':
                        end += 1
                    return start, end, src[start:end]
        i += 1
    fail(f'fim da função {name} não encontrado')


def remove_ranges(src, ranges):
    for start, end, _ in sorted(ranges, key=lambda x: x[0], reverse=True):
        src = src[:start] + src[end:]
    return re.sub(r'\n{4,}', '\n\n\n', src)


def insert_script(html):
    tag = '<script src="js/engenharia.js"></script>'
    if tag in html:
        return html
    patterns = [
        '<script src="js/fortis.js"></script>',
        '<script src="./js/fortis.js"></script>',
    ]
    for p in patterns:
        if p in html:
            return html.replace(p, tag + '\n  ' + p)
    # fallback: before any fortis.js reference
    m = re.search(r'<script[^>]+src=["\'][^"\']*fortis\.js["\'][^>]*>\s*</script>', html)
    if m:
        return html[:m.start()] + tag + '\n  ' + html[m.start():]
    fail('script js/fortis.js não encontrado no fortis.html')


def main():
    if not HTML.exists(): fail('fortis.html não encontrado')
    if not JS.exists(): fail('js/fortis.js não encontrado')

    src = JS.read_text(encoding='utf-8')
    html = HTML.read_text(encoding='utf-8')

    # Não reaplicar se já foi feito
    if ENG_JS.exists() and 'var ENG' not in src and 'var MP' not in src:
        print('Sprint 13 já parece aplicada. Nada a fazer.')
        return

    blocks = []
    for name in ['MP', 'ENG']:
        blocks.append(find_block_var(src, name))
    for name in ['calcEngCusto', 'renderMPEditor']:
        blocks.append(find_func(src, name))

    blocks_sorted = sorted(blocks, key=lambda x: x[0])
    content = '/* FORTIS — Engenharia e matérias-primas\n   Extraído com segurança do js/fortis.js na Sprint 13.\n   Mantém variáveis e funções globais para preservar compatibilidade. */\n\n'
    content += '\n\n'.join(b[2].strip() for b in blocks_sorted) + '\n'

    new_src = remove_ranges(src, blocks)
    new_html = insert_script(html)

    BACKUP.mkdir(exist_ok=True)
    shutil.copy2(JS, BACKUP / 'fortis.js')
    shutil.copy2(HTML, BACKUP / 'fortis.html')
    if ENG_JS.exists():
        shutil.copy2(ENG_JS, BACKUP / 'engenharia.js')

    ENG_JS.write_text(content, encoding='utf-8')
    JS.write_text(new_src, encoding='utf-8')
    HTML.write_text(new_html, encoding='utf-8')

    # validações simples
    jst = JS.read_text(encoding='utf-8')
    engt = ENG_JS.read_text(encoding='utf-8')
    ht = HTML.read_text(encoding='utf-8')
    checks = [
        ('js/engenharia.js criado', ENG_JS.exists()),
        ('MP movido', 'var MP' in engt and 'var MP' not in jst),
        ('ENG movido', 'var ENG' in engt and 'var ENG' not in jst),
        ('calcEngCusto movido', 'function calcEngCusto' in engt and 'function calcEngCusto' not in jst),
        ('renderMPEditor movido', 'function renderMPEditor' in engt and 'function renderMPEditor' not in jst),
        ('HTML carrega engenharia antes do fortis', ht.find('js/engenharia.js') != -1 and ht.find('js/engenharia.js') < ht.find('js/fortis.js')),
    ]
    print('Sprint 13 concluída.')
    print('Backup criado em:', BACKUP)
    print('Arquivo criado:', ENG_JS)
    print('Validações:')
    for label, ok in checks:
        print(' -', label + ':', 'OK' if ok else 'FALHOU')
    if not all(ok for _, ok in checks):
        fail('validação falhou; restaure pelo backup ou git restore')

if __name__ == '__main__':
    main()
