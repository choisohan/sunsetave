import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModelProvider } from './contexts/modelContext';
import About from './pages/About';
import Avenue from './components/Avenue';
import { useEffect, useState } from 'react';

import HouseViewer from './components/HouseViewer';
import Test from './pages/Test';
import { EnvProvider } from './contexts/envContext';

function App() {

  const [iCalURL, setIcalURL] = useState();

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const icalURL = params.get("url");
    setIcalURL(icalURL);
  },[])

  return (
    <EnvProvider>
      <ModelProvider>

      <Router>
      <Routes>
          <Route path="/" element={ !iCalURL ? <Avenue /> : <HouseViewer url={iCalURL} />} />
          <Route path="/about" element={<About />} />
          <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
    </ModelProvider>

    </EnvProvider>


  );
}

export default App;
