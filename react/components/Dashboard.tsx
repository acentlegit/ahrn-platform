
import { colors } from '../../design-system/tokens';

export default function Dashboard() {
  return (
    <div style={{ background: colors.background, color: colors.text, padding: 24 }}>
      <h1>Home Reliability Index: 87</h1>
      <div>HVAC – Risk in 21 days</div>
      <div>Water – Healthy</div>
    </div>
  );
}
