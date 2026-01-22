#!/usr/bin/env bash
# scripts/sync-todo.sh — OPTIONAL helper (non-binding)
#
# Generates TODO.generated.md from specs/project-tasks.md (non-binding).
# This script must NOT modify P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md. These are the task truth sources.

set -euo pipefail

IN_PATH="specs/project-tasks.md"
OUT_PATH="TODO.generated.md"

if [[ ! -f "$IN_PATH" ]]; then
  echo "[sync-todo] No $IN_PATH found. Nothing to generate."
  exit 0
fi

python3 - <<'PY'
import datetime, pathlib

IN_PATH = pathlib.Path("specs/project-tasks.md")
OUT_PATH = pathlib.Path("TODO.generated.md")

txt = IN_PATH.read_text(encoding="utf-8", errors="ignore")

header = f"""# TODO.generated.md — Generated View (Non-Binding)

Last Generated: 2026-01-05

This file is generated from `specs/project-tasks.md` and is **not authoritative**.
Authoritative tasks live in `P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md`.

---

"""

OUT_PATH.write_text(header + txt, encoding="utf-8")
print(f"[sync-todo] Wrote {OUT_PATH}")
PY
