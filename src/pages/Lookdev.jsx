import React, { useEffect, useState } from 'react'
import Sky from '../components/Sky'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton, FastForwardButton } from '../components/Buttons'
import {Clock} from '../components/Clock'
import { useHouseModel , useTexture} from '../contexts/modelContext'
import House from '../components/House'


export default function Lookdev() {

    const modelContext = useHouseModel();
    const textureContext = useTexture();

    const [ houseArray, setHouseArray ] = useState([])
  

    useEffect(()=>{
      if(!modelContext || !textureContext) return;
      const wallArr = Object.keys(textureContext).filter(key=>key.includes('wallA/')).map(key=>parseInt(key.split('/')[1]))
      const roofArr = Object.keys(textureContext).filter(key=>key.includes('roof/')).map(key=>parseInt(key.split('/')[1]))


      const variations = [];

     for (let b of wallArr) {
        for (let d of roofArr) {
          variations.push({
            wallA: b, wallB: b, roof: d, windowsA:2,windowsB:3,
        })
    }}

    setHouseArray(variations);



    },[modelContext, textureContext ])


    const PositionOnGrid = (i)=>{
      const max = 10 ; 
      var x =Math.round( i % max); 
      var y=Math.round( i / max *.5 );
      return [x * 2 , 0 , y * 3 ];
    }

  return (<>
      <Canvas camera={{position: [0,15,10], fov:30}}  style={{width:'100vw', height:'100vh' }}   >
        
         <OrbitControls />
         <Sky />

         {houseArray.map((item,i)=>
              <mesh key={i} position={ PositionOnGrid(i) } >
                  <House  property ={item} onClick={_=>{}}  />
              </mesh>
         )}

  
    </Canvas>
  
  <div className='fixed z-[1] bottom-0 right-0 p-5 ' >
    <div className='bg-white p-2' >
      <Clock />
    {Intl.DateTimeFormat().resolvedOptions().timeZone}
    </div>
      <SkipBackwardButton />
      <FastForwardButton />
      <SkipForwardButton />
    </div>
  </>

  )
}
