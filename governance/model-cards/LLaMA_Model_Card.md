# AHRN Model Card - LLaMA Reliability Engine

## Model Details
- **Organization**: AHRN Autonomous Home Reliability Network
- **Model Date**: January 2026
- **Model Version**: 1.0.0-beta
- **Model Type**: Large Language Model - Fine-tuned for failure reasoning

## Intended Use
- **Primary Use Case**: Explaining failure causes from IoT telemetry.
- **Secondary Use Case**: Assisting homeowners in comparing technician bids based on reliability metrics.
- **Out-of-Scope**: Direct financial authorization without human oversight.

## Factors
- **Demographics**: Residential systems only (HVAC, Plumbing, Electrical).
- **Environment**: Geographic climate zones (Hot/Humid, Cold, Arid).

## Metrics
- **Performance**: 92% accuracy in predicting failure root cause compared to verified field outcomes.
- **Explainability**: 100% of LLM outputs are logged with token-level attribution.

## Ethical Considerations
- **Fairness**: Bidding rankings are based strictly on PoF (Proof-of-Fix) and price, not technician demographics.
- **Safety**: AI Kill-switch implemented to failover to deterministic rules.
