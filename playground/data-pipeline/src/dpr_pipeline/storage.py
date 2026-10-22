"""Reading and writing, wherever the data lives.

A path decides the destination. "data/bronze" is a local folder, "s3://bucket/bronze" is S3 and
"abfs://container/bronze" is Azure. The rest of the code never knows which one is in use, which is
what lets one council run this on S3 and another on Azure from the same repo.
"""

from __future__ import annotations

import json
from typing import Any

import fsspec


class Storage:
    """A folder, local or in the cloud."""

    def __init__(self, root: str) -> None:
        self.root = root.rstrip("/")
        self.fs, _ = fsspec.core.url_to_fs(self.root)

    def path(self, *parts: str) -> str:
        return "/".join([self.root, *[p.strip("/") for p in parts]])

    def write_json(self, name: str, payload: Any) -> str:
        """Write one json file and return where it went."""
        target = self.path(name)
        self.fs.makedirs(self._parent(target), exist_ok=True)
        with self.fs.open(target, "w") as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)
        return target

    def read_json(self, name: str) -> Any:
        with self.fs.open(self.path(name), "r") as handle:
            return json.load(handle)

    def list(self, pattern: str = "*") -> list[str]:
        try:
            return sorted(self.fs.glob(self.path(pattern)))
        except FileNotFoundError:
            return []

    def exists(self, name: str = "") -> bool:
        return bool(self.fs.exists(self.path(name) if name else self.root))

    @staticmethod
    def _parent(target: str) -> str:
        return target.rsplit("/", 1)[0]
