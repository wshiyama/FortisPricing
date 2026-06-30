# Sprint 16 — move relatório para js/relatorio.js
# Seguro: preserva funções globais e não usa type="module"

from pathlib import Path
import re, shutil, sys

ROOT = Path.cwd()
html_path = ROOT / "fortis.html"
js_path = ROOT / "js" / "fortis.js"
rel_path = ROOT / "js" / "relatorio.js"
backup_dir = ROOT / "backup-sprint16-relatorio"

FUNCS = ["renderRel", "renderAbar", "doPrint"]

def fail(msg):
    print("ERRO:", msg)
    sys.exit(1)

def find_func_block(src, name):
    pat = re.compile(r"function\s+" + re.escape(name) + r"\s*\([^)]*\)\s*\{")
    m = pat.search(src)
    if not m:
        return None
    start = m.start()
    i = m.end() - 1
    depth = 0
    in_str = None
    esc = False
    in_line = False
    in_block = False
    while i < len(src):
        ch = src[i]
        nx = src[i+1] if i+1 < len(src) else ""
        if in_line:
            if ch == "\n":
                in_line = False
        elif in_block:
            if ch == "*" and nx == "/":
                in_block = False
                i += 1
        elif in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == in_str:
                in_str = None
        else:
            if ch == "/" and nx == "/":
                in_line = True
                i += 1
            elif ch == "/" and nx == "*":
                in_block = True
                i += 1
            elif ch in ("'", '"', "`"):
                in_str = ch
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    while end < len(src) and src[end] in " \t\r\n":
                        end += 1
                    return start, end, src[start:end]
        i += 1
    return None

def ensure_script(html, script_src, before_src=None):
    if script_src in html:
        return html
    tag = f'<script src="{script_src}"></script>'
    if before_src and before_src in html:
        pattern = re.compile(r'<script[^>]+src=["\']' + re.escape(before_src) + r'["\'][^>]*>\s*</script>', re.I)
        m = pattern.search(html)
        if m:
            return html[:m.start()] + tag + "\n" + html[m.start():]
    return html.replace("</body>", "  " + tag + "\n</body>")

def main():
    if not html_path.exists():
        fail("fortis.html não encontrado.")
    if not js_path.exists():
        fail("js/fortis.js não encontrado.")

    src = js_path.read_text(encoding="utf-8")
    html = html_path.read_text(encoding="utf-8")

    if rel_path.exists() and all((f"function {n}" in rel_path.read_text(encoding="utf-8")) for n in FUNCS):
        print("Sprint 16 já parece aplicada. Nada a fazer.")
        return

    blocks = []
    spans = []
    for name in FUNCS:
        res = find_func_block(src, name)
        if not res:
            fail(f"função {name}() não encontrada em js/fortis.js. Envie o arquivo atual para ajustar a sprint.")
        spans.append((res[0], res[1], name))
        blocks.append(res[2].strip())

    backup_dir.mkdir(exist_ok=True)
    shutil.copy2(html_path, backup_dir / "fortis.html")
    shutil.copy2(js_path, backup_dir / "fortis.js")
    if rel_path.exists():
        shutil.copy2(rel_path, backup_dir / "relatorio.js")

    new_src = src
    for start, end, name in sorted(spans, reverse=True):
        new_src = new_src[:start].rstrip() + "\n\n" + new_src[end:].lstrip()

    rel_content = "/* Sprint 16 — Relatório / Impressão\n   Funções movidas de js/fortis.js sem alteração de lógica.\n*/\n\n" + "\n\n".join(blocks) + "\n"
    rel_path.write_text(rel_content, encoding="utf-8")
    js_path.write_text(new_src, encoding="utf-8")

    html = ensure_script(html, "js/relatorio.js", before_src="js/fortis.js")
    html_path.write_text(html, encoding="utf-8")

    final_js = js_path.read_text(encoding="utf-8")
    rel_js = rel_path.read_text(encoding="utf-8")
    final_html = html_path.read_text(encoding="utf-8")

    ok = True
    for name in FUNCS:
        if f"function {name}" not in rel_js:
            print(f"- {name}(): FALHOU em relatorio.js")
            ok = False
        elif f"function {name}" in final_js:
            print(f"- {name}(): ainda ficou em fortis.js")
            ok = False
        else:
            print(f"- {name}(): OK")
    if "js/relatorio.js" not in final_html:
        print("- script relatorio.js no HTML: FALHOU")
        ok = False
    else:
        print("- script relatorio.js no HTML: OK")

    if not ok:
        fail("validação falhou. Restaurar backup-sprint16-relatorio se necessário.")

    print("\nSprint 16 concluída.")
    print("Criado:", rel_path)
    print("Backup:", backup_dir)

if __name__ == "__main__":
    main()
