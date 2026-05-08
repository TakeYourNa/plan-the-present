import { useApp } from '../../context/AppContext';
import DimensionCard from './DimensionCard';

export default function ProfileStage() {
  const { profile, setStage, DIMENSIONS } = useApp();

  const filled = DIMENSIONS.filter((d) => profile[d.key]?.trim()).length;
  const canProceed = filled >= 3;

  return (
    <div className="stage profile-stage">
      <header className="stage-header">
        <h1 className="app-title">规划当下</h1>
        <p className="app-subtitle">
          你不是达成某个目标的工具。你是自己的目的。<br />
          在开始之前，请告诉我们关于你自己的一些事。
        </p>
      </header>

      <div className="dimensions-grid">
        {DIMENSIONS.map((d) => (
          <DimensionCard
            key={d.key}
            dimension={d}
            value={profile[d.key]}
          />
        ))}
      </div>

      <div className="stage-footer">
        <span className="progress-hint">
          已填写 {filled}/{DIMENSIONS.length} 个维度
          {!canProceed && '（至少填写3个以继续）'}
        </span>
        <button
          className="btn-primary"
          disabled={!canProceed}
          onClick={() => setStage('dialogue')}
        >
          开始对话
        </button>
      </div>
    </div>
  );
}
