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


export default function HouseViewer(props) {
  const { param } = useParams();
  const [property, setProperty]= useState({id: param, cellNumb: 0});




return (<>
<Canvas style={{height:'100vh'}} camera={{position: [0,1,9], fov: 20}}>
  <CameraControls />
  <Sky />
  <TerrainMesh editMode={false} onGridUpdate={()=>{}}/>
  <Pixelate />
  <House property={property} onClick={()=>{}}/>

</Canvas>


<div className='fixed z-[1] bottom-0 right-0 ' >
    <FastForwardButton />
    <SkipForwardButton />
</div>
</>

)

}
