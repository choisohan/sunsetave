import React, { useEffect } from 'react'
import { useState } from 'react';
import House from './House';
import { Canvas } from '@react-three/fiber';
import { fetchCalendar } from '../calendar/FetchCalendar';
import { OrbitControls } from '@react-three/drei';

export default function HouseViewer(props) {

  const [property, setProperty]= useState({name:'house_A1', mapUDIMs: [0,0] });

    

    useEffect(()=>{
        Promise.resolve( fetchCalendar(props.url) ).then(data=>{

          console.log( '[HouseViewer]',props.url ,data )
        })
    },[props.url])


  return (
    <div>
        <Canvas style={{height:'100vh'}} camera={{position: [2,2,5], fov: 10}}>
          <OrbitControls />
          <House property={property} />
        </Canvas>
    </div>
  )
}
