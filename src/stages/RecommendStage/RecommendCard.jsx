import { useEffect, useState, useRef } from 'react';

export default function RecommendCard({ data, index }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`recommend-card ${visible ? 'card-visible' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="card-header">
        <h3 className="card-title">{data.title}</h3>
        <span className={`card-difficulty difficulty-${data.difficulty === '高' ? 'high' : data.difficulty === '中' ? 'mid' : 'low'}`}>
          {data.difficulty}难度
        </span>
      </div>

      {data.rootCause && (
        <p className="card-rootcause">{data.rootCause}</p>
      )}

      {data.strategicRationale && (
        <p className="card-rationale">{data.strategicRationale}</p>
      )}

      {data.steps && data.steps.length > 0 && (
        <ol className="card-steps">
          {data.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}

      <div className="card-meta">
        {data.expectedResistance && (
          <p className="card-resistance">
            <span className="meta-label">阻力：</span>{data.expectedResistance}
          </p>
        )}
        {data.costOfInaction && (
          <p className="card-cost">
            <span className="meta-label">不行动的代价：</span>{data.costOfInaction}
          </p>
        )}
      </div>

      <div className="card-footer">
        {data.dimension && <span className="card-dimension">{data.dimension}</span>}
        {data.timeHorizon && <span className="card-timehorizon">{data.timeHorizon}</span>}
      </div>
    </div>
  );
}
