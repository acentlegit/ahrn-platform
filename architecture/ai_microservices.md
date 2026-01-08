
# AHRN AI Microservices Architecture

Services:
1. llama-inference-service
2. rag-retrieval-service
3. bid-negotiation-service
4. voice-ai-service
5. fine-tuning-service

Communication:
- REST/gRPC internal
- Auth via mTLS + service tokens
- No direct DB access except RAG service

Each service is independently scalable and GPU-isolated.
