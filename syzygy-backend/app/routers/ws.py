from fastapi import WebSocket, WebSocketDisconnect
from ..state import app_state

async def telemetry_ws(ws: WebSocket):
    await app_state.bus.register(ws, "telemetry")
    try:
        while True:
            await ws.receive_text()  # keepalive / ignore
    except WebSocketDisconnect:
        await app_state.bus.unregister(ws, "telemetry")

async def sim_ws(ws: WebSocket):
    await app_state.bus.register(ws, "sim")
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        await app_state.bus.unregister(ws, "sim")
