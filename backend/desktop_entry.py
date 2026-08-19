import argparse
import logging
import os
import sys
import traceback
from pathlib import Path


def resource_path(path: str) -> Path:
    base = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
    return base / path


def configure_logging(data_dir: Path) -> None:
    data_dir.mkdir(parents=True, exist_ok=True)
    logging.basicConfig(
        filename=data_dir / "fintrack.log",
        format="%(asctime)s %(levelname)s %(message)s",
        level=logging.INFO,
    )


def run_migrations(database_url: str) -> None:
    from alembic import command
    from alembic.config import Config

    config = Config(str(resource_path("alembic.ini")))
    config.set_main_option("script_location", str(resource_path("alembic")))
    config.set_main_option("sqlalchemy.url", database_url)
    command.upgrade(config, "head")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", required=True)
    parser.add_argument("--port", required=True, type=int)
    args = parser.parse_args()

    data_dir = Path(args.data_dir)
    os.environ["FINTRACK_DATA_DIR"] = str(data_dir)
    configure_logging(data_dir)
    database_url = f"sqlite:///{(data_dir / 'fintrack.db').as_posix()}"
    os.environ["DATABASE_URL"] = database_url
    os.environ["CORS_ORIGINS"] = "null,http://localhost:5173"

    run_migrations(database_url)

    from app.seed import main as seed_database
    from app.main import app
    import uvicorn

    seed_database()
    logging.info("Starting FinTrack API on port %s", args.port)
    uvicorn.run(app, host="127.0.0.1", port=args.port, log_config=None, access_log=False)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        data_dir = Path(os.environ.get("FINTRACK_DATA_DIR", Path.home() / "FinTrack"))
        data_dir.mkdir(parents=True, exist_ok=True)
        (data_dir / "fintrack-startup-error.log").write_text(traceback.format_exc(), encoding="utf-8")
        raise
