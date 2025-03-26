import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModelProvider } from './contexts/modelContext';
import Avenue from './components/Avenue';

import HouseViewer from './components/HouseViewer';
import { EnvProvider } from './contexts/envContext';
import Test from './pages/Test';
import About from './pages/About';
import Lookdev from './pages/Lookdev';

function App() {
  return (
    <EnvProvider>
      <ModelProvider>
      <Router>
      <Routes>
          <Route path="/" element={<Avenue /> } />
          
          <Route path="/test" element={<Test /> } />
          <Route path="/about" element={<About /> } />
          <Route path="/dev" element={<Lookdev /> } />

          <Route path="/:param" element={<HouseViewer /> } />

      </Routes>
    </Router>
    </ModelProvider>

    </EnvProvider>


  );
}

export default App;
