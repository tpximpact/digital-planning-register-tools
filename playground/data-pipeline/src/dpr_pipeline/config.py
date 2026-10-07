"""Settings, loaded from a yaml file with environment variables taking precedence.

Nothing secret lives in the yaml file, so it is safe to commit and the repo can be public.
Credentials come from the environment and are read by the storage layer, not by us.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

import yaml

DEFAULT_CONFIG_PATH = Path("config/config.yaml")
EXAMPLE_CONFIG_PATH = Path("config/config.example.yaml")


@dataclass
class SourceConfig:
    """One council's source system."""

    name: str
    url: str
    page_size: int = 1000
    max_records: int | None = None
    app_token: str | None = None


@dataclass
class Settings:
    bronze: str = "data/bronze"
    silver: str = "data/silver"
    gold: str = "data/gold"
    database_path: str = "data/dpr.duckdb"
    sources: dict[str, SourceConfig] = field(default_factory=dict)

    def source(self, name: str) -> SourceConfig:
        try:
            return self.sources[name]
        except KeyError:
            known = ", ".join(sorted(self.sources)) or "none"
            raise SystemExit(f"No source called '{name}' in the config. Known sources: {known}")


def load(path: str | Path | None = None) -> Settings:
    """Read the config file, then let the environment override it.

    Falls back to the example file so that a fresh clone runs without any setup.
    """
    config_path = Path(path) if path else DEFAULT_CONFIG_PATH
    if not config_path.exists() and EXAMPLE_CONFIG_PATH.exists():
        config_path = EXAMPLE_CONFIG_PATH

    raw: dict = {}
    if config_path.exists():
        raw = yaml.safe_load(config_path.read_text(encoding="utf-8")) or {}

    storage = raw.get("storage") or {}
    database = raw.get("database") or {}

    settings = Settings(
        bronze=os.getenv("DPR_BRONZE", storage.get("bronze", "data/bronze")),
        silver=os.getenv("DPR_SILVER", storage.get("silver", "data/silver")),
        gold=os.getenv("DPR_GOLD", storage.get("gold", "data/gold")),
        database_path=os.getenv("DPR_DATABASE", database.get("path", "data/dpr.duckdb")),
    )

    for name, values in (raw.get("sources") or {}).items():
        values = values or {}
        settings.sources[name] = SourceConfig(
            name=name,
            url=values.get("url", ""),
            page_size=int(values.get("page_size", 1000)),
            max_records=values.get("max_records"),
            app_token=os.getenv(f"{name.upper()}_APP_TOKEN"),
        )

    return settings
