import joblib
from typing import List

class AIService:
    def __init__(self, model_path: str, threshold: float = -0.1):
        self.model_path = model_path
        self.threshold = threshold
        try:
            self.model = joblib.load(model_path)
        except Exception:
            self.model = None  # Will be replaced by external model server if desired

    def score(self, features: List[float]) -> float:
        if self.model is None:
            # Fallback: simple heuristic score
            return -1.0
        # IsolationForest decision_function: higher is normal, lower is anomaly
        return float(self.model.decision_function([features]))

    def is_anomaly(self, score: float) -> bool:
        return score < self.threshold
