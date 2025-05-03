
#main.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.Search import Search
from app.routes import users
import app.firebase
from fastapi import FastAPI
from app.api.HalalCheck import ecodes, ingredients, status
from app.api.Products import Products
from app.database.database import create_db_and_tables


app = FastAPI(
    title="HalalLife API",
    docs_url="/docs",
    redoc_url="/redoc",
    version="1.0.0",
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
)

@app.middleware("http")
async def handle_404(request: Request, call_next):
    response = await call_next(request)
    if response.status_code == 404:
        return JSONResponse(status_code=404, content={"message": "Could not find this route."})
    return response


@app.exception_handler(Exception)
async def handle_exception(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"message": "An unknown error occurred!"})
  
#routs
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(Products.router, prefix="/api/products", tags=["products"])
# app.include_router(ingredients.router, prefix="/api/ingredients", tags=["ingredients"])
# app.include_router(ecodes.router, prefix="/api/ecodes", tags=["ecodes"])
# app.include_router(status.router, prefix="/api/status", tags=["status"])
app.include_router(Search.router, prefix="/api/Search", tags=["Search"])
