import './App.css';
import Scenes from './components/Scenes';
import HouseBuilder from './components/HouseBuilder';
import { ModelProvider } from './contexts/modelContext';

function App() {
  return (
      <ModelProvider>
        <HouseBuilder />
      </ModelProvider>
  );
}

export default App;
