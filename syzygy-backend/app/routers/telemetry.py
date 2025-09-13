import json
from fastapi import APIRouter, Depends
from ..models.schemas import TelemetryIn, DetectionOut, EventLogOut
from ..deps import get_ai, get_chain
from ..state import app_state

router = APIRouter()

@router.post("/ingest")
async def ingest(payload: TelemetryIn, ai=Depends(get_ai), chain=Depends(get_chain)):
    score = ai.score(payload.features)
    is_anom = ai.is_anomaly(score)
    broadcast_msg = {
        "type": "telemetry",
        "satellite_id": payload.satellite_id,
        "ts": payload.ts,
        "features": payload.features,
        "score": score,
        "is_anomaly": is_anom,
        "meta": payload.meta or {},
    }
    await app_state.bus.broadcast(broadcast_msg, "telemetry")

    tx_hash = None
    if is_anom:
        details = {
            "satellite_id": payload.satellite_id,
            "ts": payload.ts,
            "score": score,
            "meta": payload.meta or {},
        }
        tx_hash = chain.log_event("ANOMALY", json.dumps(details))

    return {
        "detection": DetectionOut(score=score, is_anomaly=is_anom, threshold=ai.threshold).model_dump(),
        "tx_hash": tx_hash,
    }
