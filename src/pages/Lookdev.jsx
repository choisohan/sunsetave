import React, { useEffect, useState } from 'react'
import Sky from '../components/Sky'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton, FastForwardButton } from '../components/Buttons'
import {Clock} from '../components/Clock'
import { useTimestamp } from '../contexts/envContext'
import { useHouseModel , useTexture} from '../contexts/modelContext'
import House from '../components/House'


export default function Lookdev() {

    const timestamp = useTimestamp();
    const modelContext = useHouseModel();
    const textureContext = useTexture();

    const [ houseArray, setHouseArray ] = useState([])
  

    useEffect(()=>{
      if(!modelContext || !textureContext) return;
      console.log('textureContext : ',textureContext)

      const meshArr = Object.keys(modelContext).map(key=>parseInt(key.split('_')[1]))
      const wallArr = Object.keys(textureContext).filter(key=>key.includes('wallA/')).map(key=>parseInt(key.split('/')[1]))
      const roofArr = Object.keys(textureContext).filter(key=>key.includes('roof/')).map(key=>parseInt(key.split('/')[1]))
      const windowsArr = Object.keys(textureContext).filter(key=>key.includes('windowsA/')).map(key=>parseInt(key.split('/')[1]))
      const shadeArr = Object.keys(textureContext).filter(key=>key.includes('shade/')).map(key=>parseInt(key.split('/')[1]))
      const doorArr = Object.keys(textureContext).filter(key=>key.includes('door/')).map(key=>parseInt(key.split('/')[1]))


      const variations = [];

      /*
      for (let a of meshArr) {
        for (let b of wallArr) {
          for (let c of wallArr) {
          for (let d of roofArr) {
            for (let e of windowsArr) {
              for (let f of windowsArr) {
                for (let g of shadeArr) {
                  for (let h of doorArr) {
                    variations.push({
                      mesh: a , wallA: b, wallB: c, roof: d, windowA:e, windowB:f, shade:g, doorArr:h
                    })
        }}}}}}}}
     */

     for (let b of wallArr) {
        for (let d of roofArr) {
          variations.push({
            wallA: b, wallB: b, roof: d, windowsA:2,windowsB:3,
        })
    }}
    console.log(variations)

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
