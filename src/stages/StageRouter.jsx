import { useApp } from '../context/AppContext';
import ProfileStage from './ProfileStage/ProfileStage';
import DialogueStage from './DialogueStage/DialogueStage';
import RecommendStage from './RecommendStage/RecommendStage';

export default function StageRouter() {
  const { stage } = useApp();

  switch (stage) {
    case 'profile':
      return <ProfileStage />;
    case 'dialogue':
      return <DialogueStage />;
    case 'recommend':
      return <RecommendStage />;
    default:
      return <ProfileStage />;
  }
}
