
# Model Card – AHRN LLaMA Reliability Model

## Model Overview
- Base Model: LLaMA 3 8B Instruct
- Fine-Tuning: LoRA on repair outcomes

## Intended Use
- Failure explanation
- Bid reasoning
- Decision support

## Not Intended For
- Autonomous approvals
- Financial decisions

## Data Sources
- IoT telemetry (anonymized)
- Repair outcomes

## Evaluation Metrics
- Proof-of-Fix correlation
- Prediction accuracy

## Ethical Considerations
- Human oversight mandatory
