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
<div className="w-full h-screen flex flex-col md:flex-row relative overflow-hidden lg:overflow-auto" >

  <Canvas camera={{ position: [0,-5,8], fov: 20}} ref={canvasRef} className="w-full h-full min-h-[500px] md:w-1/2 md:h-[100vh] " >

    <CameraControls target={new Vector3(0,.75,0)}/>
    <Sky timezone={ timezone  } />
    <Pixelate />
    <House property={ { id : param  } } onUpdateProperty ={ onUpdateProperty } hoverable={false} onClick={()=>{}} onMouseEnter={()=>{}}/>
  </Canvas>

  <div className="w-full md:w-1/2 lg:p-4 absolute bottom-0 md:static  ">

    <div className='text-right'>
      <span className='inline-flex '>
        <img src='/images/userProfile.png' className='w-[35px] h-[35px] lg:w-[70px] lg:h-[70px]' alt='profile'/>
        <span className='[line-break:anywhere] text-3xl md:text-7xl	'>{ name }</span>
      </span>

      <div className='bg-[#748060] p-1 m-1 w-fit border-4 border-black justify-self-end' >
        <Clock timezone={timezone}/>{timezone} </div>
    </div>


    
    <div className='flex column justify-self-end lg:gap-2 lg:mx-1 lg:my-1'>
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




