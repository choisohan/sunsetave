import React, { useEffect } from 'react'
import { useState } from 'react';
import House from './House';
import { Canvas } from '@react-three/fiber';
import { useParams } from 'react-router-dom';
import CameraControls from './CameraControls';
import { Pixelate } from '../shaders/CustomPostProcessing';
import Sky from './Sky';
import TerrainMesh from './TerrainMesh';
import { FastForwardButton, SkipForwardButton } from './Buttons';
import { Html } from '@react-three/drei';


export default function HouseViewer(props) {
  const { param } = useParams();
  const [property, setProperty]= useState({id: param, cellNumb: 0});




return (<>
<Canvas style={{height:'100vh'}} camera={{position: [0,1,9], fov: 20}}>
  <CameraControls />
  <Sky />
  <Pixelate />
  <House property={property} onClick={()=>{}} onMouseEnter={()=>{}}/>
  {/*
  <TerrainMesh editMode={false} setGrids={()=>{}}  onMouseEnter={()=>{}} />
  */}

  <Html>
    <div className='flex center'>
    <FastForwardButton /><SkipForwardButton />
    </div>

  </Html>

</Canvas>

</>

)

}
