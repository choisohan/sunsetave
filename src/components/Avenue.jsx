import React, {  useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import HouseBuilder from './HouseBuilder'
import Sky from './Sky'
import {Pixelate} from '../shaders/CustomPostProcessing'
import CameraControls from './CameraControls'
import TerrainMesh from './TerrainMesh'

export default function Avenue() {

  const [items, setItems] = useState([
   {id : 'sample/?SampleCalendar' , cellNumb :8   },
   {id : 'sample/?BruceLee' , cellNumb : 6 },
   {id : 'sample/?Einstein' ,  cellNumb : 5},
   //{id : '8c063daee6e0ebb0eac75293727a2b85d9024b26c96fd2ad4f9a7489bbf835a1'}
  ])

  const [selectedItem, setSelectedItem] = useState();

  const [editMode, setEditMode] = useState(true)
  const [grid, setGrid] = useState();

  const getTransformByCellNumb = (cellNumb)=>{
    if(!cellNumb) cellNumb = 1; 
    cellNumb = String(cellNumb).padStart(3,"0");
    const cell = grid.getObjectByName(`cell_${cellNumb}`)
    const position = [cell.position.x,cell.position.z, 0];
    const rotation = [cell.rotation.x, cell.rotation.z , 0 ];
    return [position, rotation]
  }

  useEffect(()=>{
    if(!grid) return;

    setItems( _items =>{
      return _items.map( _item =>{
        var cellNumb = _item.cellNumb;
        
        const [position, rotation] = getTransformByCellNumb(cellNumb);
        return {..._item, position: position, rotation : rotation }
      })
    })
  },[grid])

  const onMouseMoveOnGrid= (cellNumb)=>{
    if(!selectedItem) return;

    // Move a house
    const [position, rotation] = getTransformByCellNumb(cellNumb);
    
    setItems(_items =>{
      const itemArr = [..._items];
      itemArr[selectedItem.i] = {...itemArr[selectedItem.i], position: position ,rotation: rotation}
      return itemArr; 
    })
    

  }

  return (
    <div>
    <Canvas camera={{position: [5,7,10], fov: 20}} style={{width:'100vw', height:'100vh'}}  >

    <CameraControls />
    <Sky />

    <Pixelate />
    {items.map( (item,i) =>
        <House key={i} property ={item} onClick={()=>{  setSelectedItem( {...items[i], i: i})  }} />
    )}


    <TerrainMesh editMode ={editMode} onGridUpdate={setGrid} onMouseMoveOnGrid={onMouseMoveOnGrid} onComplete={()=>{setSelectedItem()}}/>
     
    {/*
    
    <GroundPlane editMode={ editMode&&selectedItem?true:false } onPointerMove={moveObject} onFinish={()=>{setSelectedItem()}} />

    */}
    </Canvas>

    <div style={{position:'fixed',zIndex:1, bottom:5, right:5}}>
      <PlayerButtons />
      <button onClick={()=>{setEditMode(x=> !x)}}>{editMode?"Exit Edit Mode":"Enter Edit Mode"}</button>
    </div>



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