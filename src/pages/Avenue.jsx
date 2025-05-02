import React, {  useEffect, useRef, useState } from 'react'
import House from '../components/House'
import { Canvas } from '@react-three/fiber'
import Sky from '../components/Sky'
import {Pixelate} from '../shaders/CustomPostProcessing'
import TerrainMesh from '../components/TerrainMesh'
import * as Buttons from '../components/Buttons'
import {Clock} from '../components/Clock'
import Ocean from '../components/Ocean'
import CameraControls from '../components/CameraControls'
import { Vector3 } from 'three'
import { useUpdatePopup } from '../contexts/PopupContext'
import HouseDetailWindow from '../components/HouseDetailWindow'

const defaultItems =  [  {id : 'sample&&paris' , cellNumb :3  },
  {id : 'sample&&tokyo' , cellNumb : 20 },   
  {id : 'sample&&ny' , cellNumb : 2 },
  {id : 'sample&&hoian' , cellNumb : 35},
  {id : 'sample&&fes' , cellNumb : 55 },
  {id : 'sample&&van' , cellNumb : 32},
  {id : 'sample&&nz' , cellNumb : 12},
  {id : 'sample&&bs' , cellNumb : 1},
  {id : 'sample&&gk' , cellNumb :63},]

const stored = localStorage.getItem("houses");
var array = [] ;
if (stored) {
  array = JSON.parse(stored);
} else {
  array = defaultItems;
}



export default function Avenue() {
  const [items, setItems] = useState(array)
  const [editMode, setEditMode] = useState(false)
  const [grid, setGrid] = useState();
  const canvasRef = useRef ();
  const selectedRef = useRef();
  const setPopup = useUpdatePopup();
  const [loaded, setLoaded] = useState(false)

  

  useEffect(()=>{
    if(!grid) return;
    setItems( _items =>{
      return _items.map( _item =>{
        const cellNumb = _item.cellNumb;
        const transform = grid[cellNumb];
        return {..._item, ...transform};
      })
    })
    setLoaded(true)
  },[grid ])

  const onEnterNewCell= i =>{
    if( editMode && selectedRef.current ){
      const isOccupiedItems = items.filter( item=> item.cellNumb === i )
      if(isOccupiedItems.length > 0 ) return; 

      const transform = grid[i];
      setItems(_arr =>{
        const copied = [..._arr];
        copied[selectedRef.current] = {...copied[selectedRef.current],  cellNumb : i , ...transform  }
        return copied; 
      })

    }
  }

  const onHouseUpdate = (newProperty, i ) =>{
    if(!newProperty){
      const _items =[...items];
      _items.splice(i, 1)
      setItems(_items);
    }
  }

  const AddNewHouse = (newID )=>{
    setItems(_arr=> [..._arr, { id : newID }])
    selectedRef.current = ( items.length )
    setEditMode(true)
  }

  const OnSaveUpdate = ()=>{
    setEditMode(false)
    console.log( items )
    localStorage.setItem( "houses" , JSON.stringify(items));
  }


  const OnClickHouse = (_property, _i ) =>{
    if(editMode){
      selectedRef.current = _i!== selectedRef.current ? _i : null
    }else{
      setPopup(<HouseDetailWindow property={_property} />);
    }
  }

  return (
    <>
    <Canvas camera={{ fov: 20}} style={{width:'100vw', height:'100vh'}} className={ `transition-opacity duration-500 ${!loaded ? "opacity-0":"" }` } >

        <CameraControls position={new Vector3(-34, 5,-22)} target={new Vector3(-8  ,-1 , 5)} />
        <Pixelate size={3} />    

        <Sky />
        <TerrainMesh editMode={editMode} setGrids={setGrid} onEnterNewCell={onEnterNewCell}  />
        {items.map( (item,i) =>
          <House key={i} id={item.id} transform={{ position : item.position, rotation: item.rotation }}
                detailWindowOpen={!editMode}
                onUpdateProperty={(x)=>{onHouseUpdate(x,i)}}
                onClick={(x)=>{OnClickHouse(x,i) }} />
        )}
        <Ocean />
    </Canvas>

    <div className='fixed z-[1] bottom-1 right-0  lg:m-3 gap-1 flex flex-col' >
      <div className='bg-[#748060] lg:text-[150%] px-1 py-1 lg:px-4 lg:py-2 border-4 border-black '>
        <Clock />
      </div>
      <div className='flex max-w-full gap-0 lg:gap-1 '>
        {!editMode? <ControlPannel canvasRef ={canvasRef} editMode={editMode} setEditMode={setEditMode} AddNewHouse={AddNewHouse} items={items}/>:
                    <EditPannel  OnSaveUpdate={OnSaveUpdate} onLeave={()=>{setEditMode(false)}}
                    onReset={()=>{
                      setItems(defaultItems);
                      setEditMode(false)
                      localStorage.setItem( "houses" , JSON.stringify(defaultItems));
                                            }}/>}
      </div>
    </div>
    </>)

}



const ControlPannel = ({ canvasRef , items , setEditMode , AddNewHouse })=>{
  return <>
        <Buttons.InfoButton />
        <Buttons.SkipBackwardButton /><Buttons.SkipForwardButton /> <Buttons.FastForwardButton />
        <Buttons.TimeShiftButton />
        <Buttons.RecordButton canvasRef={canvasRef} />
        <Buttons.AddNewHouseButton onAddNew={AddNewHouse} currentIds={items.map(item=> item.id )} />
        <Buttons.EditModeButton setEditMode={setEditMode}/>
  </>
}

const EditPannel = ({OnSaveUpdate , onLeave , onReset })=>{
  return <>
      <Buttons.SaveButton onClick={OnSaveUpdate}/>
      <Buttons.CozyButton className='pixelButton' onClick={onLeave}>Releave</Buttons.CozyButton>
      <Buttons.CozyButton className='pixelButton' onClick={onReset}>Reset</Buttons.CozyButton>
  </>
}