import React, { useEffect } from 'react'
import { useState } from 'react';
import House from './House';
import { Canvas } from '@react-three/fiber';
import { fetchCalendar } from './ReadCalendar';

export default function HouseViewer(props) {

  const [property, setProperty]= useState({name:'house_A1', mapUDIMs: [0,0] });


  //http://localhost:3000/?url=/calendar/ical/8c063daee6e0ebb0eac75293727a2b85d9024b26c96fd2ad4f9a7489bbf835a1%40group.calendar.google.com/public/basic.ics
    useEffect(()=>{
        Promise.resolve(fetchCalendar(props.url)).then(data=>{
        })
    },[props.url])


  return (
    <div>
        <Canvas camera={{position: [2,5,7], fov: 50}}>
            <House property={property} />
        </Canvas>
    </div>
  )
}
