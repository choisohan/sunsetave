import React, {  useEffect, useRef } from 'react'
import { useState } from 'react';
import House from '../components/House';
import { Canvas } from '@react-three/fiber';
import { useParams } from 'react-router-dom';
import CameraControls from '../components/CameraControls';
import { Pixelate } from '../shaders/CustomPostProcessing';
import Sky from '../components/Sky';
import * as Buttons from '../components/Buttons';
import {  Vector3} from 'three';
import { Clock, timestampToHourFloat } from '../components/Clock';
import { EventTable } from '../components/EventTable';
import TerrainMesh from '../components/TerrainMesh';
import { useSetTimezoneOverride, useTimezoneOverride } from '../contexts/envContext';


export default function HouseViewer(props) {
  const divRef = useRef();
  const { param } = useParams();
  const [ name , setName ] = useState('????')
  const canvasRef = useRef();  
  const [events, setEvents]= useState();
  const setTimezoneOverride = useSetTimezoneOverride();
  const timezoneOverride = useTimezoneOverride(); 
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile , setIsMobile] = useState(false);
  const [target , setTarget] = useState(new Vector3(0,0.5,0));

  const onUpdateProperty =( newProperty )=>{
  
    if(!newProperty){
      setName( 'NOT FOUND');
      return;
    }
    if(newProperty.name) setName(newProperty.name)
    if(newProperty.timezone) setTimezoneOverride(newProperty.timezone);
    if(newProperty.events) setEvents(newProperty.events);
  }


  useEffect(()=>{
    if(!timezoneOverride) return; 
    
    const timestamp = new Date().valueOf(); 
    const hourFloat = timestampToHourFloat(timestamp, timezoneOverride );
    if(hourFloat< 7/24 || hourFloat> 19/24){
      setDarkMode(true)
    }

  },[timezoneOverride])

  useEffect(() => {
    var _isMobile = false; 

    if (divRef.current) {
      const width = divRef.current.getBoundingClientRect().width;
      if( width < 768 ){
        _isMobile = true; 
      }
      else{
        _isMobile =window.matchMedia("(max-width: 768px)").matches;
      }

      setIsMobile(_isMobile)

      /*
      if(_isMobile){
        const height = divRef.current.getBoundingClientRect().height;
        console.log( width / height  )
        setTarget(new Vector3(0,  width / height , 0)); 
      }
        */

    }




  }, [divRef.current ]);




return (
<div className={`houseViewer ${ darkMode ? "darkMode" : ""} ${isMobile ? "small" :"" } ${props.className}`}
                ref={divRef} >

  <Canvas className="w-full h-full "  camera={{ position: [0,-5,8], fov: 20}} ref={canvasRef}>
    <TerrainMesh editMode={false} setGrids={()=>{}} onEnterNewCell={()=>{}} onClick={()=>{}} />
    <CameraControls target={target}/>
    <Sky/>
    <Pixelate />
    <House property={ { id :props.id|| param  } } onUpdateProperty ={ onUpdateProperty } hoverable={false} onClick={()=>{}} onMouseEnter={()=>{}}/>
  </Canvas>




  <div className="houseInfo" >
    <div className='text-left title'>
      <span className='inline-flex '>
        <img src='/images/userProfile.png' className='w-[35px] h-[35px] lg:w-[70px] lg:h-[70px]' alt='profile'/>
       <a href={`/`+ props.id|| param  }>
        <span className='[line-break:anywhere]'>{ name }</span>
       </a>
      </span>
    </div>
    <div className='bg-[#748060] p-1 m-1 w-fit border-4 border-black justify-self-end' >
        <Clock timezone={timezoneOverride}/>{timezoneOverride}
    </div>


    <div className='flex column lg:gap-1 lg:p-2 w-full hideOnSmall '>
      <Buttons.SkipBackwardButton />
      <Buttons.FastForwardButton />
      <Buttons.SkipForwardButton />
      <Buttons.RecordButton canvasRef={canvasRef}/>
      <Buttons.ReloadButton />
    </div>
    <EventTable events={events}/>

  </div>


</div>
)

}




