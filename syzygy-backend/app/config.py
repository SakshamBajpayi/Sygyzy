import os
from dotenv import load_dotenv
load_dotenv()

class Settings:
    BLOCKCHAIN_ENABLED: bool = os.getenv("BLOCKCHAIN_ENABLED", "true").lower() == "true"
    BLOCKCHAIN_RPC: str = os.getenv("BLOCKCHAIN_RPC", "http://127.0.0.1:7545")
    CONTRACT_ABI_PATH: str = os.getenv("CONTRACT_ABI_PATH", "contracts/SecurityEvents.json")
    CONTRACT_ADDRESS: str = os.getenv("CONTRACT_ADDRESS", "")
    CHAIN_ID: int = int(os.getenv("CHAIN_ID", "1337"))
    PRIVATE_KEY: str = os.getenv("PRIVATE_KEY", "")
    PUBLIC_ADDRESS: str = os.getenv("PUBLIC_ADDRESS", "")
    AI_MODEL_PATH: str = os.getenv("AI_MODEL_PATH", "models/isoforest.joblib")
    ANOMALY_THRESHOLD: float = float(os.getenv("ANOMALY_THRESHOLD", "-0.1"))
    WS_MAX_CLIENTS: int = int(os.getenv("WS_MAX_CLIENTS", "200"))

settings = Settings()
