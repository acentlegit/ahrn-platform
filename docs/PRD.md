# PRD: Autonomous Home Reliability Network (AHRN)

## 1. Vision
Transform home maintenance from a reactive, insurance-based "warranty" model into a proactive, outcome-based "reliability" network.

## 2. Target Audience
- **Homeowners**: Residents seeking high system uptime and verified proof-of-fix.
- **Technicians**: Skilled providers seeking stable, high-yield jobs with pre-diagnosed telemetry.
- **Network Admins**: Overseers of the autonomous marketplace and dispute resolution.

## 3. Core Features
### 3.1. Homeowner Journey
- **HRI (Home Reliability Index)**: A real-time score based on node cluster health.
- **Outcome Market**: Bidding based on "Proof-of-Fix" guarantees rather than just hourly rates.
- **System Forecasts**: AI-powered failure prediction with 21-day intervention windows.

### 3.2. Technician Journey
- **IOT Diagnostics**: Direct access to sensor telemetry before site arrival.
- **Cryptographic Evidence Sealing**: Hash-based verification of work to trigger instant payouts.
- **Market Yield Analysis**: Heatmaps of high-probability failure clusters.

## 4. Technical Architecture
- **Monorepo**: NestJS Backend + React Frontend.
- **Event-Sourced Ledger**: All diagnostic and repair actions are logged for HRI calculation.
- **AI Engine**: LLaMA-based reasoning for diagnostic briefs and bid comparisons.

## 5. Success Metrics
- **Mean Time To Intervention (MTTI)**: < 48 hours for predicted failures.
- **Proof-of-Fix Validation**: > 98% accuracy on first intervention.
- **HRI Recovery Rate**: Average +15 pts within 30 days of node restoration.
