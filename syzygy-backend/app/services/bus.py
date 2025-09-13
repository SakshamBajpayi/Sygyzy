import asyncio
import json

class BroadcastBus:
    def __init__(self):
        self.telemetry_clients: set = set()
        self.sim_clients: set = set()

    async def register(self, websocket, channel: str):
        await websocket.accept()
        if channel == "telemetry":
            self.telemetry_clients.add(websocket)
        else:
            self.sim_clients.add(websocket)

    async def unregister(self, websocket, channel: str):
        if channel == "telemetry":
            self.telemetry_clients.discard(websocket)
        else:
            self.sim_clients.discard(websocket)

    async def broadcast(self, message: dict, channel: str):
        data = json.dumps(message)
        targets = list(self.telemetry_clients if channel == "telemetry" else self.sim_clients)
        for ws in targets:
            try:
                await ws.send_text(data)
            except Exception:
                # Drop broken sockets
                await self.unregister(ws, channel)
