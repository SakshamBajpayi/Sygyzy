from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class TelemetryIn(BaseModel):
    satellite_id: str
    ts: int
    features: List[float]
    meta: Dict[str, str] | None = None

class DetectionOut(BaseModel):
    score: float
    is_anomaly: bool
    threshold: float

class EventLogIn(BaseModel):
    type: str = Field(examples=["ANOMALY", "DEFENSE_ACTIVATED"])
    details: Dict[str, str] = Field(default_factory=dict)

class EventLogOut(BaseModel):
    tx_hash: str
    type: str
    details: Dict[str, str]

class SimCommand(BaseModel):
    mode: str = Field(pattern="^(red|blue)$")
    attack: str = Field(pattern="^(jamming|spoofing|injection)$")
    intensity: int = Field(ge=0, le=100)
    duration_sec: int = Field(default=20, ge=1, le=600)
