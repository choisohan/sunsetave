import React, { useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GroundPlane } from './Ground'
import HouseBuilder from './HouseBuilder'


export default function Avenue() {


  const [items, setItems] = useState([
    /*
    {x:-1, name:'house_A2' , time: .5 , roof:'R1',wall:'W1',windows:'W1' , timezone: "Europe/London" , id: 'sample/SampleCalendar' },
    {x:0, name:'house_A3' ,time: .25 , timezone: "America/Vancouver"  ,id: 'sample/Mozart' },
    {x:1.5, name:'house_A4' , timezone: "Asia/Hong_Kong" , id: 'sample/Darwin'}
    */
   {id : 'sample/?SampleCalendar' , x:0  },
  // {id : 'sample/?BruceLee' , x:0 },
  // {id : 'sample/?Einstein' , x:1 },
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
    <Canvas camera={{position: [1,2,5], fov: 20}} style={{width:'100vw', height:'100vh'}}>
      
      <OrbitControls />
      <GroundPlane editMode={ editMode&&selectedItem?true:false } onPointerMove={moveObject} onFinish={()=>{setSelectedItem()}} />

      
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