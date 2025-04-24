import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ModelProvider } from './contexts/modelContext';
import { EnvProvider } from './contexts/envContext';
import { PopupProvider, usePopup } from './contexts/PopupContext';
import Avenue from './pages/Avenue';
import HouseViewer from './pages/HouseViewer';
import Test from './pages/Test';
import About from './pages/About';
import Lookdev from './pages/Lookdev';
import HouseBuilder, { HouseCodeOutput } from './components/HouseBuilder';
import { useState } from 'react';


function App() {


  return (
    <PopupProvider>
      <EnvProvider>
          <ModelProvider>
          <Router>
            <Body>
              <Routes>
                  <Route path="/" element={<Avenue />} />
                  <Route path="/test" element={<Test /> } />
                  <Route path="/about" element={<About /> } />
                  <Route path="/dev" element={<Lookdev /> } />
                  <Route path="/builder" element={<Builder />} />
                  <Route path="/:param" element={<HouseViewer className='!h-screen !w-screen'/> } />
              </Routes>
        </Body>
            </Router>
        </ModelProvider>
      </EnvProvider>
    </PopupProvider>
  );
}

const Body = ({children})=>{
  const popupContext = usePopup();
  return <>
  {children}
  {popupContext}
  </>
}

const Builder = ()=>{
  const [design,setDesign] = useState();

  return <div>
    <HouseBuilder onUpdateProperty={setDesign} />
    <HouseCodeOutput design={design}/>
  </div>}


export default App;
