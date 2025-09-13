import random
import time
from typing import Dict, List

def apply_attack(features: List[float], attack: str, intensity: int) -> List[float]:
    f = features[:]
    scale = max(0.1, intensity / 100.0)
    if attack == "jamming":
        noise = [random.gauss(0, scale) for _ in f]
        return [a + n for a, n in zip(f, noise)]
    if attack == "spoofing":
        bias = scale * 2.0
        return [a + bias for a in f]
    if attack == "injection":
        idx = random.randrange(len(f))
        f[idx] = f[idx] + scale * 5.0
        return f
    return f

def defense_hint(attack: str) -> Dict[str, str]:
    if attack == "jamming":
        return {"defense": "frequency_hopping"}
    if attack == "spoofing":
        return {"defense": "authentication"}
    if attack == "injection":
        return {"defense": "input_firewall"}
    return {"defense": "monitor"}
