import React, { useEffect, useState }  from 'react'
import Sky from '../components/Sky'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton, FastForwardButton } from '../components/Buttons'
import {Clock} from '../components/Clock'
import TerrainMesh from '../components/TerrainMesh'
import InstancingOnGrid from '../components/InstancingOnGrid'
import SVGTerrain from '../components/SVGTerrain'


export default function Test() {


  const [grid, setGrid] = useState();

  return (<>
    <Canvas camera={{position: [0,7,10], fov:30}}  style={{width:'100vw', height:'100vh' }}   >
        
         <OrbitControls />


      <SVGTerrain onCellUpdate={_=>{}}/>




{/*
//Testing initial Instancing Concept
        <TerrainMesh editMode={false} onGridUpdate={setGrid} onMouseMoveOnGrid={()=>{}} onComplete={()=>{}} />
        <InstancingOnGrid grid={grid} count={10} speed={2} />
*/}



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
