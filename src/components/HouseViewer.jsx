import React, { useEffect } from 'react'
import { useState } from 'react';
import House from './House';
import { Canvas } from '@react-three/fiber';
import { fetchCalendar } from './ReadCalendar';

export default function HouseViewer(props) {

  const [property, setProperty]= useState({name:'house_01', mapUDIMs: [0,0] });


  //http://localhost:3000/?url=/calendar/ical/8c063daee6e0ebb0eac75293727a2b85d9024b26c96fd2ad4f9a7489bbf835a1%40group.calendar.google.com/public/basic.ics
    useEffect(()=>{
        Promise.resolve(fetchCalendar(props.url)).then(data=>{
            console.log(data )
        })
    },[props.url])


  return (
    <div>
        <Canvas style={{width:'100%',height:'100%'}}  camera={{position: [2,5,7], fov: 50}}>
            <House property={property} />
        </Canvas>
    </div>
  )
}
