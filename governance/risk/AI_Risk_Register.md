# AHRN AI Risk Register

| Risk ID | Description | Impact | Probability | Mitigation |
|---------|-------------|--------|-------------|------------|
| R-101   | AI Hallucination in failure diagnosis | High | Medium | Human-in-the-loop validation, IoT sensor grounding |
| R-102   | Bias in Technician Bidding scores | Medium | Low | Transparant scoring metrics, multiple weighted factors |
| R-103   | Data Privacy Breach (PII) | Critical | Low | Encryption at rest, tenant-isolated vector stores |
| R-104   | Autonomous Financial Commitment | High | Low | AI Kill-switch, mandatory manual authorization for high-value claims |

## Mitigation Strategy
- **Grounding**: All AI reasoning must be anchored to real-time IoT telemetry.
- **Explainability**: Decision logs are stored as cryptographically hashed evidence.
- **Escalation**: Anomalies automatically trigger manual review by AHRN Admins.
