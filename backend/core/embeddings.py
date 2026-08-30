import json
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Union

class SemanticMatcher:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        # We load the model. This will download on first run.
        self.model = SentenceTransformer(model_name)

    def embed_text(self, text: str) -> List[float]:
        embedding = self.model.encode(text)
        return embedding.tolist()

    def serialize_embedding(self, embedding: List[float]) -> str:
        return json.dumps(embedding)

    def deserialize_embedding(self, serialized_embedding: str) -> List[float]:
        if not serialized_embedding:
            return []
        return json.loads(serialized_embedding)
        
    def compute_similarity(self, emb1: List[float], emb2: List[float]) -> float:
        if not emb1 or not emb2:
            return 0.0
        vec1 = np.array(emb1)
        vec2 = np.array(emb2)
        
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
            
        return float(dot_product / (norm1 * norm2))

    def compute_similarity_text(self, text1: str, text2: str) -> float:
        emb1 = self.embed_text(text1)
        emb2 = self.embed_text(text2)
        return self.compute_similarity(emb1, emb2)

# Singleton instance to reuse the loaded model across the app
semantic_matcher = SemanticMatcher()
