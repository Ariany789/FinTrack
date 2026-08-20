from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from app.api.routes.routes import router
from app.core.config import get_settings

settings = get_settings()
app = FastAPI(title="FinTrack API", version="1.0.0", description="API de controle financeiro pessoal, sem autenticação.")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, allow_origin_regex=r"^http://127\.0\.0\.1:\d+$", allow_credentials=False, allow_methods=["*"], allow_headers=["*"])
app.include_router(router, prefix="/api/v1")

@app.exception_handler(IntegrityError)
async def integrity_error_handler(_, __): return JSONResponse(status_code=409, content={"detail": "Operação viola uma regra de integridade dos dados."})
