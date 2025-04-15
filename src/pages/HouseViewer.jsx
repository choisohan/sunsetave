import React, {  useRef } from 'react'
import { useState } from 'react';
import House from '../components/House';
import { Canvas } from '@react-three/fiber';
import { useParams } from 'react-router-dom';
import CameraControls from '../components/CameraControls';
import { Pixelate } from '../shaders/CustomPostProcessing';
import Sky from '../components/Sky';
import * as Buttons from '../components/Buttons';
import {  Vector3} from 'three';
import { Clock } from '../components/Clock';
import { EventTable } from '../components/EventTable';

export default function HouseViewer(props) {
  const { param } = useParams();
  const [ name , setName ] = useState('????')
  const canvasRef = useRef();  
  const [events, setEvents]= useState();
  const [timezone,setTimezone] = useState( Intl.DateTimeFormat().resolvedOptions().timeZone )


  const onUpdateProperty =( newProperty )=>{
  
    if(!newProperty){
      setName( 'NOT FOUND');
      return;
    }
    
    if(newProperty.name) setName(newProperty.name)
    if(newProperty.timezone) setTimezone(newProperty.timezone);
    if(newProperty.events) setEvents(newProperty.events);

  }




return (
<div className="w-full h-screen flex flex-col md:flex-row" >

  <Canvas camera={{ position: [0,-5,8], fov: 20}} ref={canvasRef} className="w-full h-full min-h-[500px] md:w-1/2 md:h-[100vh] " >

    <CameraControls target={new Vector3(0,.75,0)}/>
    <Sky timezone={ timezone  } />
    <Pixelate />
    <House property={ { id : param  } } onUpdateProperty ={ onUpdateProperty } hoverable={false} onClick={()=>{}} onMouseEnter={()=>{}}/>
  </Canvas>

  <div className="w-full md:w-1/2 p-4">

    <div>
      <span className='inline-flex'>
        <img src='/images/userProfile.png' className='w-[70px] h-[70px]' alt='profile'/>
        <h2 className='[line-break:anywhere]'>{ name }</h2>
      </span>

      <div className='bg-[#748060] p-1 m-1 w-fit border-4 border-black' >
        <Clock timezone={timezone}/>{timezone} </div>
    </div>


    
    <div className='flex column gap-2' style={{marginTop:'10px', marginBottom:'10px'}}>
      <Buttons.SkipBackwardButton />
      <Buttons.FastForwardButton />
      <Buttons.SkipForwardButton />
      <Buttons.RecordButton canvasRef={canvasRef}/>
      <Buttons.ReloadButton />
    </div>

    <EventTable events={events}/>
  </div>
    <a href='/' className='fixed -top-0 left-1 lg:text-3xl' >Sunset Ave</a>


</div>
)

}




