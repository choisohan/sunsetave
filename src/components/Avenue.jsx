import React, { useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GroundPlane } from './Ground'
import HouseBuilder from './HouseBuilder'

import { SampleCalendars } from '../calendar/SampleCalendars'
import { SortCalendarData } from '../calendar/SortEvents'


export default function Avenue() {

  useEffect( ()=>{
    const fetchData = async () => {
      SampleCalendars.forEach(cal=>{
        //const sorted = await SortCalendarData(cal);
      })
    };
    fetchData();
  },[])


  const [items, setItems] = useState([
    {x:-1, name:'house_A2' , time: .5 , roof:'R1',wall:'W1',windows:'W1' },{x:0, name:'house_A3' ,time: .25},{x:1.5, name:'house_A4'}
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
    <Canvas camera={{position: [2,5,7], fov: 50}} style={{width:'100vw', height:'100vh'}}>
      
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