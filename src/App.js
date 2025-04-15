import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModelProvider } from './contexts/modelContext';
import { EnvProvider } from './contexts/envContext';
import { PopupProvider } from './contexts/PopupContext';
import Avenue from './pages/Avenue';
import HouseViewer from './pages/HouseViewer';
import Test from './pages/Test';
import About from './pages/About';
import Lookdev from './pages/Lookdev';
import HouseBuilder from './components/HouseBuilder';


function App() {

  return (
    <PopupProvider>
      <EnvProvider>
          <ModelProvider>
            <Router>
              <Routes>
                  <Route path="/" element={<Avenue /> } />
                  <Route path="/test" element={<Test /> } />
                  <Route path="/about" element={<About /> } />
                  <Route path="/dev" element={<Lookdev /> } />
                  <Route path="/builder" element={<HouseBuilder /> } />\
                  <Route path="/:param" element={<HouseViewer /> } />
              </Routes>
            </Router>
        </ModelProvider>
      </EnvProvider>
    </PopupProvider>
  );
}


export default App;
