from fastapi import APIRouter, Depends
from ..models.schemas import DetectionOut, TelemetryIn
from ..deps import get_ai

router = APIRouter()

@router.post("/", response_model=DetectionOut)
async def detect(payload: TelemetryIn, ai=Depends(get_ai)):
    score = ai.score(payload.features)
    return DetectionOut(score=score, is_anomaly=ai.is_anomaly(score), threshold=ai.threshold)
