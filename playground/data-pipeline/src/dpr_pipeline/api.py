"""The application: two sets of endpoints that are deliberately kept apart.

  api_odp     the API: only the Open Digital Planning routes in the standard's OpenAPI spec
  admin_data  the JSON behind the admin page at /admin, hidden from the docs
  admin_mappers  the JSON behind the value mappers page at /admin/mappers, also hidden

    uvicorn dpr_pipeline.api:app --reload
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from . import admin_data, admin_mappers
from .api_common import STATIC
from .api_odp import public, unredacted
from .api_responses import envelope

app = FastAPI(
    title="DPR published applications",
    description=(
        "Planning applications in the post submission standard.\n\n"
        "Only the Open Digital Planning routes from the standard's OpenAPI spec: x-client picks the"
        " council, paging is page and resultsPerPage, and every response is data, pagination and"
        " status.\n\n"
        "**ODP public** is approved records, redacted. **ODP unredacted** is every record, with"
        " extra information about it in metadata.pipeline.\n\n"
        "The admin is at /admin."
    ),
    version="0.3.0",
    openapi_tags=[
        {"name": "ODP public", "description": "In the spec. Approved records only, redacted."},
        {"name": "ODP unredacted", "description": "In the spec. Every record, unredacted."},
    ],
)


@app.exception_handler(StarletteHTTPException)
async def _http_error(_request, exc: StarletteHTTPException):
    """Errors use the same envelope, with data null, rather than FastAPI's {"detail": ...}."""
    return JSONResponse(envelope(None, code=exc.status_code, message=str(exc.detail)),
                        status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def _validation_error(_request, exc: RequestValidationError):
    return JSONResponse(
        envelope(None, code=422, message="Unprocessable Entity", detail=_describe(exc)),
        status_code=422,
    )


def _describe(exc: RequestValidationError) -> str:
    """The spec wants status.detail as a string, so the problems are joined into one."""
    return "; ".join(
        f"{'.'.join(str(part) for part in error['loc'])}: {error['msg']}"
        for error in jsonable_encoder(exc.errors())
    )


app.include_router(public)
app.include_router(unredacted)
app.include_router(admin_data.router)
app.include_router(admin_mappers.router)


@app.get("/", include_in_schema=False)
def home():
    return RedirectResponse("/admin")


@app.get("/admin", include_in_schema=False)
def admin():
    """The admin page, with a switch between bronze, silver and gold. It uses /admin/data."""
    return FileResponse(STATIC / "admin.html")


@app.get("/admin/mappers", include_in_schema=False)
def admin_mappers_page():
    """The value mappers page: Idox statuses, MHCLG application types and so on. It uses
    /admin/mappers/data."""
    return FileResponse(STATIC / "mappers.html")


@app.get("/admin/admin.css", include_in_schema=False)
def admin_css():
    """The styles both admin pages share."""
    return FileResponse(STATIC / "admin.css", media_type="text/css")


@app.get("/lab", include_in_schema=False)
def lab_redirect():
    return RedirectResponse("/lab/")


# The review lab: prototype screens for approving and redacting, and a data explorer. Mounted last
# so nothing above is shadowed, and only if the folder is there.
_LAB = STATIC / "lab"
if _LAB.is_dir():
    app.mount("/lab", StaticFiles(directory=_LAB, html=True), name="lab")
