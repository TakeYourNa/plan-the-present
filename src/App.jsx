import { AppProvider } from './context/AppContext';
import StageRouter from './stages/StageRouter';

export default function App() {
  return (
    <AppProvider>
      <div className="app-shell">
        <StageRouter />
      </div>
    </AppProvider>
  );
}
