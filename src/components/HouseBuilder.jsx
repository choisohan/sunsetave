import React, { useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { randInt } from 'three/src/math/MathUtils.js';


export default function HouseBuilder(props) {
  const [property, setProperty]= useState({name:'house_03', mapUDIMs: [0,0] });

  useEffect(()=>{
    setProperty(_property=>({..._property,...props.property}))
  },[props.property])

  const swapGeometry=(changeNumb)=>{
    const maxNumb = 4; 
    const currentNumb = parseInt(property.name.split('_')[1])
    var newNumb = currentNumb + changeNumb; 
    if(newNumb>maxNumb){ newNumb = 1}
    if(newNumb < 1){ newNumb = maxNumb}

    setProperty(x=>({...x, name: "house_"+String(newNumb).padStart(2,"0") }))
  }

  const swapMap = ( i, changeNumb)=>{
    
    const maxNumb = 9; 
    var newUDIMs = property.mapUDIMs;
    newUDIMs[i] += changeNumb;
    if(newUDIMs[i]>maxNumb){ newUDIMs[i] = 0}
    if(newUDIMs[i] < 0){ newUDIMs[i] = maxNumb}

    setProperty(x=>({...x, mapUDIMs : newUDIMs}))
  }

  const generateRandom = ()=>{
    swapGeometry(randInt(1,4));
    swapMap(0,randInt(0,4));
    swapMap(1,randInt(0,4));

  }

  return (
  <div style={{display:'flex', width:'100%', maxWidth:'600px', gap:'10px'}} >

    <Canvas style={{aspectRatio:1.725}} camera={{position: [4,3,8], fov: 15}} >
      <OrbitControls />
      <House property ={property}/>
    </Canvas>

    <div className='options'>
      <OptionSelector onChange={swapGeometry} >Geometry</OptionSelector>
      <OptionSelector onChange={ d =>{swapMap(0,d)} } >Roof</OptionSelector>
      <OptionSelector onChange={ d =>{swapMap(1,d)} } >Wall</OptionSelector>
      <button onClick={generateRandom}>R</button>
    </div>
  </div>
  )
}


const OptionSelector = props =>{
  return <div className='optionSelector'>
    <button onClick={()=>{props.onChange(-1)}}>←</button>
    {props.children}
    <button onClick={()=>{props.onChange(+1)}}>→</button>
    </div>
} 