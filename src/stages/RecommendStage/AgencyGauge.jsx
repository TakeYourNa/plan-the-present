export default function AgencyGauge({ score }) {
  const pct = Math.round((score ?? 0.7) * 100);

  const label = pct >= 70 ? '你当前内心充盈着行动能量' :
                pct >= 40 ? '你有一些能量，但也在消耗中' :
                '你此刻的能量很低，这完全没关系';

  return (
    <div className="agency-gauge">
      <h4>当前内驱力参考</h4>
      <div className="gauge-bar">
        <div className="gauge-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="gauge-label">
        {label} — <em>这不影响建议的方向，只标注距离</em>
      </p>
    </div>
  );
}
