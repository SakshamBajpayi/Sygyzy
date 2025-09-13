from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import telemetry, detection, events, simulate, ws
from .state import init_state, close_state

app = FastAPI(title="Syzygy 2.0 Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(telemetry.router, prefix="/telemetry", tags=["telemetry"])
app.include_router(detection.router, prefix="/detect", tags=["detection"])
app.include_router(events.router, prefix="/events", tags=["events"])
app.include_router(simulate.router, prefix="/simulate", tags=["simulate"])
app.add_websocket_route("/ws/telemetry", ws.telemetry_ws)
app.add_websocket_route("/ws/sim", ws.sim_ws)

@app.on_event("startup")
async def on_startup():
    await init_state()

@app.on_event("shutdown")
async def on_shutdown():
    await close_state()

@app.get("/health")
async def health():
    return {"status": "ok"}
