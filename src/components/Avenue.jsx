import React, {  useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import Sky from './Sky'
import {Pixelate} from '../shaders/CustomPostProcessing'
import CameraControls from './CameraControls'
import TerrainMesh from './TerrainMesh'
import HouseDetailWindow from './HouseDetailWindow'
import { AddNewHouseButton, EditModeButton, FastForwardButton , ReloadButton, SkipForwardButton} from './Buttons'
import {Clock} from './Clock'




export default function Avenue() {



  const [items, setItems] = useState([
   {id : 'sample&&SampleCalendar' , cellNumb :7   },
   {id : 'sample&&BruceLee' , cellNumb : 6 },
   {id : 'sample&&Einstein' ,  cellNumb : 5},
   {id : 'sample&&Darwin' ,  cellNumb : 8},
  ])

  const [selectedItem, setSelectedItem] = useState();
  const [editMode, setEditMode] = useState(false)
  const [grid, setGrid] = useState();
  const [popup, setPopup] = useState();

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

  const onHouseClicked=(_i, _detailProperty)=>{
    setSelectedItem({..._detailProperty, i: _i} )  
    if(!editMode){
      setPopup( <HouseDetailWindow property={selectedItem}
        onClose={()=>{
          setSelectedItem(null);
          setPopup(null);
      }}/> );
    }
  }


  return (
    <>
    <Canvas camera={{position: [5,.5,9], fov: 20}} style={{width:'100vw', height:'100vh'}}  >

    <CameraControls />
    <Sky />

    <Pixelate />
    {items.map( (item,i) =>
        <House key={i} property ={item} onClick={_props=>{  onHouseClicked(i, _props )  }} />
    )}


    <TerrainMesh editMode ={editMode} onGridUpdate={setGrid} onMouseMoveOnGrid={onMouseMoveOnGrid} onComplete={()=>{setSelectedItem()}}/>
     
    </Canvas>

    <div className='fixed z-[1] bottom-0 right-0 ' >
      <div className='bg-white'><Clock /></div>
      <FastForwardButton /><SkipForwardButton />
      <ReloadButton onClick={()=>{setItems(x=>[...x])}} /> {/* todos : Reload needs more works */}
      <AddNewHouseButton />
      <EditModeButton editMode={editMode} setEditMode={setEditMode}/>
    </div>


    {popup}




    </>)

}


