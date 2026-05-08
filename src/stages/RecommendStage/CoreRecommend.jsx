export default function CoreRecommend({ data }) {
  return (
    <div className="core-recommend animate-in">
      <div className="core-badge">核心建议</div>
      <h2 className="core-title">{data.title}</h2>

      {data.rootCause && (
        <div className="rootcause-section">
          <h4 className="section-label">根源分析</h4>
          <p>{data.rootCause}</p>
        </div>
      )}

      {data.hiddenNeed && (
        <div className="hidden-need-section">
          <h4 className="section-label">你真正渴望的</h4>
          <p>{data.hiddenNeed}</p>
        </div>
      )}

      {data.strategicRationale && (
        <div className="rationale-section">
          <h4 className="section-label">战略分析</h4>
          <p>{data.strategicRationale}</p>
        </div>
      )}

      {data.steps && data.steps.length > 0 && (
        <div className="steps-section">
          <h4 className="section-label">行动路径</h4>
          <ol className="steps-list">
            {data.steps.map((s, i) => (
              <li key={i} className="step-item">{s}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="two-col">
        {data.expectedResistance && (
          <div className="resistance-section">
            <h4 className="section-label">你会遇到的阻力</h4>
            <p className="resistance-text">{data.expectedResistance}</p>
          </div>
        )}
        {data.costOfInaction && (
          <div className="cost-section">
            <h4 className="section-label">不行动的代价</h4>
            <p className="cost-text">{data.costOfInaction}</p>
          </div>
        )}
      </div>

      {data.timeHorizon && (
        <span className="core-timehorizon">{data.timeHorizon}</span>
      )}
    </div>
  );
}
