import { useApp } from '../../context/AppContext';

export default function DimensionCard({ dimension, value }) {
  const { updateProfile } = useApp();

  return (
    <div className="dimension-card">
      <label className="dimension-label">{dimension.label}</label>
      <p className="dimension-hint">{dimension.hint}</p>
      <textarea
        className="dimension-input"
        value={value || ''}
        onChange={(e) => updateProfile(dimension.key, e.target.value)}
        placeholder="写下你的真实感受..."
        rows={3}
      />
    </div>
  );
}
