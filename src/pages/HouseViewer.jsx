import React, {  useRef } from 'react'
import { useState } from 'react';
import House from '../components/House';
import { Canvas } from '@react-three/fiber';
import { useParams } from 'react-router-dom';
import CameraControls from '../components/CameraControls';
import { Pixelate } from '../shaders/CustomPostProcessing';
import Sky from '../components/Sky';
import { FastForwardButton, RecordButton, SkipBackwardButton, SkipForwardButton } from '../components/Buttons';
import {  Vector3} from 'three';
import { Clock } from '../components/Clock';
import { EventTable } from '../components/EventTable';

export default function HouseViewer(props) {
  const { param } = useParams();
  const [ property , setProperty]= useState({id: param , name :'????', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const [ name , setName ] = useState('????')
  const canvasRef = useRef();  


  const onUpdateProperty =( newProperty )=>{
  
    if(!newProperty){
      setName( 'NOT FOUND')
    }else if(newProperty.name){
      setName(newProperty.name)
      setProperty(newProperty);
    }
  }




return (
<div className="w-full h-screen flex flex-col md:flex-row" >

  <Canvas camera={{ position: [0,-5,8], fov: 20}} ref={canvasRef} className="w-full h-full min-h-[500px] md:w-1/2 md:h-[100vh] " >

    <CameraControls target={new Vector3(0,.75,0)}/>
    <Sky timezone={ property.timezone  } />
    <Pixelate />
    <House property={ { id : param  } } onUpdateProperty ={ onUpdateProperty } onClick={()=>{}} onMouseEnter={()=>{}}/>
  </Canvas>

  <div className="w-full md:w-1/2 p-4">

    <div>
      <span className='inline-flex'>
        <img src='/images/userProfile.png' className='w-[70px] h-[70px]'/>
        <h2 className='[line-break:anywhere]'>{ name }</h2>
      </span>

      <div className='bg-[#748060] p-1 m-1 w-fit border-4 border-black' >
        <Clock timezone={property.timezone}/>{property.timezone} </div>
    </div>


    
    <div className='flex column gap-2' style={{marginTop:'10px', marginBottom:'10px'}}>
      <SkipBackwardButton />
      <FastForwardButton />
      <SkipForwardButton />
      <RecordButton canvasRef={canvasRef}/>
    </div>

    <EventTable events={property.events}/>
  </div>
  <h1 className='fixed top-0 left-0'><a href='/'>Sunset Ave</a></h1>


</div>
)

}




