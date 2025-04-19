from fastapi import FastAPI, Request 
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from controllers import users 

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
)


app.include_router(users.router, prefix="/api/users", tags=["users"])


@app.middleware("http")
async def handle_404(request: Request, call_next):
    response = await call_next(request)
    if response.status_code == 404:
        return JSONResponse(status_code=404, content={"message": "Could not find this route."})
    return response


@app.exception_handler(Exception)
async def handle_exception(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"message": "An unknown error occurred!"})
