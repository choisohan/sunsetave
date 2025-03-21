import React, {  useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GroundPlane } from './Ground'
import HouseBuilder from './HouseBuilder'
import Sky from './Sky'
import { Vector3 } from 'three'
import {Pixelate} from '../shaders/CustomPostProcessing'
import CameraControls from './CameraControls'

export default function Avenue() {


  const [items, setItems] = useState([
   {id : 'sample/?SampleCalendar' , x:0  },
   {id : 'sample/?BruceLee' , x:-.5 },
   {id : 'sample/?Einstein' , x:0.5},
   //{id : '8c063daee6e0ebb0eac75293727a2b85d9024b26c96fd2ad4f9a7489bbf835a1'}
  ])

  const [selectedItem, setSelectedItem] = useState();

  const [editMode, setEditMode] = useState(false)


  const moveObject = newPosition =>{
    const _items = [...items];
    _items[selectedItem.i]= {...selectedItem, x: newPosition.x, y: newPosition.z};
    setItems(_items)
  }

  const onSelection = i =>{
    if(!selectedItem){
      setSelectedItem({...items[i], i: i})}
    }
  




  return (
    <div>
    <Canvas camera={{position: [0,1,5], fov: 20}} style={{width:'100vw', height:'100vh'}}  >


    <Pixelate />
    <CameraControls />



      <GroundPlane editMode={ editMode&&selectedItem?true:false } onPointerMove={moveObject} onFinish={()=>{setSelectedItem()}} />
      <Sky />
      
      {items.map( (item,i) =>
          <House key={i} property ={item} onClick={()=>{onSelection(i)}} />
      )}

    </Canvas>

    <div style={{position:'fixed',zIndex:1, bottom:5, right:5}}>
      <PlayerButtons />
      <button onClick={()=>{setEditMode(x=> !x)}}>{editMode?"Exit Edit Mode":"Enter Edit Mode"}</button>
    </div>


    {selectedItem && !editMode ? <SlideBar><HouseBuilder property={selectedItem} /></SlideBar> : null }

    </div>)

}

const SlideBar = (props)=>{
  return <div style={{position:"fixed", zIndex:2, top:0, right:0, width:'400px', background:"grey", height:"100%"}}>
    {props.children}
  </div>
}

const PlayerButtons = ()=>{
  return(<div>
    <button>▶</button>
  </div>)
}