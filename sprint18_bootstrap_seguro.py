from pathlib import Path
import re
import shutil

ROOT = Path(".")
html = ROOT / "fortis.html"
fortis = ROOT / "js" / "fortis.js"
main = ROOT / "js" / "main.js"
backup = ROOT / "backup-sprint18"

if not html.exists():
    raise SystemExit("ERRO: fortis.html não encontrado.")

if not fortis.exists():
    raise SystemExit("ERRO: js/fortis.js não encontrado.")

backup.mkdir(exist_ok=True)
shutil.copy2(html, backup / "fortis.html")
shutil.copy2(fortis, backup / "fortis.js")
if main.exists():
    shutil.copy2(main, backup / "main.js")

code = fortis.read_text(encoding="utf-8")

pattern = re.compile(
    r"document\.addEventListener\(\s*['\"]DOMContentLoaded['\"]\s*,\s*function\s*\(\)\s*\{(?P<body>.*?)\}\s*\)\s*;",
    re.S
)

m = pattern.search(code)

if not m:
    raise SystemExit("ERRO: bloco DOMContentLoaded não encontrado em js/fortis.js.")

body = m.group("body").strip()

new_fortis = code[:m.start()] + "\n/* INIT movido para js/main.js na Sprint 18 */\n" + code[m.end():]
fortis.write_text(new_fortis.strip() + "\n", encoding="utf-8")

main_code = f"""/* ══════════════════════════════════════════
   FORTIS — Bootstrap principal
   Sprint 18
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function(){{
{body}
}});
"""

main.write_text(main_code, encoding="utf-8")

html_code = html.read_text(encoding="utf-8")

if "js/main.js" not in html_code:
    html_code = re.sub(
        r'(<script[^>]+src=["\']js/fortis\.js["\'][^>]*>\s*</script>)',
        r'\1\n<script src="js/main.js"></script>',
        html_code,
        count=1,
        flags=re.I
    )

html.write_text(html_code, encoding="utf-8")

print("Sprint 18 concluída.")
print("- Backup criado em backup-sprint18/")
print("- DOMContentLoaded movido para js/main.js")
print("- fortis.html atualizado com js/main.js")