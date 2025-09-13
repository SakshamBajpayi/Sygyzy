from dataclasses import dataclass
from .services.ai import AIService
# If running without blockchain, keep a null chain; otherwise import the real one
try:
    from .services.blockchain import ChainService
except Exception:
    ChainService = None  # fallback for dev
from .services.bus import BroadcastBus
from .config import settings

# Optional: a no-op chain for dev without blockchain
class NullChainService:
    async def async_init(self): ...
    def log_event(self, event_type: str, details_json: str) -> str: return ""

@dataclass
class AppState:
    ai: AIService | None = None
    chain: object | None = None
    bus: BroadcastBus | None = None

app_state = AppState()

async def init_state():
    app_state.ai = AIService(model_path=settings.AI_MODEL_PATH, threshold=settings.ANOMALY_THRESHOLD)
    # Choose chain impl based on env
    if getattr(settings, "BLOCKCHAIN_ENABLED", False) and ChainService:
        chain = ChainService(
            rpc_url=settings.BLOCKCHAIN_RPC,
            abi_path=settings.CONTRACT_ABI_PATH,
            contract_address=settings.CONTRACT_ADDRESS,
            chain_id=settings.CHAIN_ID,
            private_key=settings.PRIVATE_KEY,
            public_address=settings.PUBLIC_ADDRESS,
        )
        await chain.async_init()
        app_state.chain = chain
    else:
        null_chain = NullChainService()
        await null_chain.async_init()
        app_state.chain = null_chain
    app_state.bus = BroadcastBus()

async def close_state():
    # add any graceful shutdown if needed; keep the function defined
    pass
