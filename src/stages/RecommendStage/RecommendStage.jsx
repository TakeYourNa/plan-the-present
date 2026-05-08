import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import CoreRecommend from './CoreRecommend';
import RecommendCard from './RecommendCard';
import AgencyGauge from './AgencyGauge';

export default function RecommendStage() {
  const { recommendations, setStage, setMessages, setRecommendations } = useApp();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!recommendations) return null;

  const { coreRecommendation, recommendations: recs, agencyScore, summary } = recommendations;

  const handleRestart = () => {
    setStage('profile');
    setMessages([]);
    setRecommendations(null);
  };

  return (
    <div className={`stage recommend-stage ${showContent ? 'stage-visible' : ''}`}>
      <header className="stage-header animate-in">
        <h2>当下，为你</h2>
        <p className="recommend-summary">{summary}</p>
      </header>

      <div className="animate-in" style={{ transitionDelay: '0.2s' }}>
        <AgencyGauge score={agencyScore} />
      </div>

      {coreRecommendation && <CoreRecommend data={coreRecommendation} />}

      {recs && recs.length > 0 && (
        <div className="recommendations-grid animate-in" style={{ transitionDelay: '0.4s' }}>
          <h3 className="section-title">更多方向</h3>
          {recs.map((r, i) => (
            <RecommendCard key={i} data={r} index={i} />
          ))}
        </div>
      )}

      <div className="stage-footer animate-in" style={{ transitionDelay: '0.6s' }}>
        <button className="btn-secondary" onClick={handleRestart}>
          重新开始
        </button>
      </div>
    </div>
  );
}
