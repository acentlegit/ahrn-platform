
# GPU Cost Model (Monthly)

Assumptions:
- LLaMA 3 8B
- vLLM inference
- A10G GPU

Inference:
- $0.60/hr per GPU
- Avg 20k requests/day
- Monthly ≈ $432

Fine-Tuning (LoRA):
- 1 run/month
- 6 hours on A100
- ≈ $18/run

Total Estimated AI Cost:
≈ $450–$550/month (early scale)
