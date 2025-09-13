import asyncio
import time
import json
from fastapi import APIRouter, Depends
from ..models.schemas import SimCommand, TelemetryIn
from ..deps import get_ai, get_chain
from ..state import app_state
from ..services.resilience import apply_attack, defense_hint

router = APIRouter()

@router.post("/run")
async def run_sim(cmd: SimCommand, ai=Depends(get_ai), chain=Depends(get_chain)):
    async def generator():
        start = time.time()
        base = [0.1, 0.2, 0.3, 0.4]
        while time.time() - start < cmd.duration_sec:
            features = apply_attack(base, cmd.attack, cmd.intensity) if cmd.mode == "red" else base
            ts = int(time.time() * 1000)
            score = ai.score(features)
            is_anom = ai.is_anomaly(score)
            msg = {
                "type": "sim",
                "attack": cmd.attack,
                "mode": cmd.mode,
                "ts": ts,
                "features": features,
                "score": score,
                "is_anomaly": is_anom,
            }
            await app_state.bus.broadcast(msg, "sim")
            await app_state.bus.broadcast(
                {"type": "telemetry", "satellite_id": "SIM", "ts": ts, "features": features, "score": score, "is_anomaly": is_anom, "meta": {}},
                "telemetry",
            )
            if is_anom:
                tx_hash = chain.log_event("ANOMALY_SIM", json.dumps({"attack": cmd.attack, "mode": cmd.mode, "score": score, "ts": ts}))
                await app_state.bus.broadcast({"type": "event", "event_type": "ANOMALY_SIM", "tx_hash": tx_hash}, "telemetry")
            await asyncio.sleep(1.0)
        # Optional defense suggestion
        hint = defense_hint(cmd.attack)
        tx_hash = chain.log_event("DEFENSE_SUGGEST", json.dumps(hint))
        await app_state.bus.broadcast({"type": "event", "event_type": "DEFENSE_SUGGEST", "details": hint, "tx_hash": tx_hash}, "telemetry")

    asyncio.create_task(generator())
    return {"status": "started"}
