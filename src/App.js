import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModelProvider } from './contexts/modelContext';
import About from './pages/About';
import Avenue from './components/Avenue';
import { useEffect } from 'react';

import { fetchCalendar } from './components/ReadCalendar';

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
