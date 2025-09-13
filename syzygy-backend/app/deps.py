from .services.ai import AIService
from .services.blockchain import ChainService
from .state import app_state

def get_ai() -> AIService:
    return app_state.ai

def get_chain() -> ChainService:
    return app_state.chain
