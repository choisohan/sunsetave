import React, { useEffect } from 'react'
import { useState } from 'react';
import House from './House';
import { Canvas } from '@react-three/fiber';
import { useParams } from 'react-router-dom';
import CameraControls from './CameraControls';
import { Pixelate } from '../shaders/CustomPostProcessing';
import Sky from './Sky';
import { FastForwardButton, RecordButton, SkipBackwardButton, SkipForwardButton } from './Buttons';
import { Vector3 } from 'three';
import { Clock } from './Clock';

export default function HouseViewer(props) {
  const { param } = useParams();
  const [property, setProperty]= useState();

  useState(()=>{
    console.log( 'viewer: ',param, property )
  },[property])


return (<div className="w-full h-screen flex flex-col md:flex-row" style={{opacity: property ?  1 : 0 }}>
<Canvas camera={{ position: [0,-5,8], fov: 20}}>
  <CameraControls target={new Vector3(0,.75,0)}/>
  <Sky />
  <Pixelate />
  <House property={{id: param}} onUpdateProperty={ d=> setProperty( d)} onClick={()=>{}} onMouseEnter={()=>{}}/>
</Canvas>


{!property? null : 
<div className="w-full md:w-1/2 p-4">

  <div>
    <span className='inline-flex'>
      <img src='/images/userProfile.png' className='w-[100px] h-[100px]'/>
      <h2 className='[line-break:anywhere]'>{ property.name }</h2>
    </span>

    <div className='bg-[#748060] p-1 m-1 w-fit border-4 border-black' >
      <Clock timezone={property.timezone}/>{property.timezone} </div>
  </div>
  <div className='flex column gap-2' style={{marginTop:'10px', marginBottom:'10px'}}>
    <SkipBackwardButton />
    <FastForwardButton />
    <SkipForwardButton />
    <RecordButton />
  </div>

  <div className='p-1 m-1 border-2 border-black overflow-auto min-h-[100px] max-h-[600px] '>
    { property.events ? property.events.map((evt, i)=>
        <div key={i} className='flex cursor-pointer hover:bg-gray-200'>
          <span style={{width:'100px'}}>{evt.startMoment.format("hh:mm A")}</span>
          <span>{evt.summary}</span>
        </div>
    ): null }
  </div>
</div>
}



</div>

)

}
