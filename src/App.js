import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HouseBuilder from './components/HouseBuilder';
import { ModelProvider } from './contexts/modelContext';
import About from './pages/About';
import Avenue from './components/Avenue';

function App() {
  return (
    <ModelProvider>

    <Router>
    <Routes>
        <Route path="/" element={<Avenue />} />
        <Route path="/about" element={<About />} />
    </Routes>
  </Router>
  </ModelProvider>

  );
}

export default App;
