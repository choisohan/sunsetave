import React, { useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GroundPlane } from './Ground'


export default function Avenue() {

  const [items, setItems] = useState([
    {x:0, name:'house_02' },{x:-2},{x:2, name:'house_04'}
  ])

  const [selectedItem, setSelectedItem] = useState();


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
    <Canvas style={{width:'100vw',height:'100vh'}}  camera={{position: [2,5,7], fov: 50}} >
      
      <OrbitControls />
      <GroundPlane editMode={ selectedItem?true:false } onPointerMove={moveObject} onFinish={()=>{setSelectedItem()}} />

      
      {items.map( (item,i) =>
          <House key={i} property ={item} onClick={()=>{onSelection(i)}} />
      )}


    </Canvas>
  )
}
