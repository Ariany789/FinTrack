# -*- mode: python ; coding: utf-8 -*-
from pathlib import Path

project_root = Path.cwd()
backend_root = project_root / "backend"

a = Analysis(
    [str(backend_root / "desktop_entry.py")],
    pathex=[str(backend_root)],
    datas=[
        (str(backend_root / "alembic"), "alembic"),
        (str(backend_root / "alembic.ini"), "."),
    ],
    hiddenimports=["app.models.entities"],
)
pyz = PYZ(a.pure)
exe = EXE(pyz, a.scripts, a.binaries, a.datas, name="FinTrackBackend", console=False)
