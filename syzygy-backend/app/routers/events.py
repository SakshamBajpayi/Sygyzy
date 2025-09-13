import json
from fastapi import APIRouter, Depends
from ..models.schemas import EventLogIn, EventLogOut
from ..deps import get_chain
from ..state import app_state

router = APIRouter()

@router.post("/log", response_model=EventLogOut)
async def log_event(body: EventLogIn, chain=Depends(get_chain)):
    tx_hash = chain.log_event(body.type, json.dumps(body.details))
    await app_state.bus.broadcast({"type": "event", "event_type": body.type, "details": body.details, "tx_hash": tx_hash}, "telemetry")
    return EventLogOut(tx_hash=tx_hash, type=body.type, details=body.details)
