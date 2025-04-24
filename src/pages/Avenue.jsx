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


const SAMPLES = [
  {id : 'sample&&paris' , cellNumb : 0  },
  {id : 'sample&&tokyo' , cellNumb : 1 },   
  {id : 'sample&&ny' , cellNumb : 2 },
  {id : 'sample&&hoian' , cellNumb : 3},
  {id : 'sample&&fes' , cellNumb : 4},
  {id : 'sample&&van' , cellNumb : 5},
  {id : 'sample&&nz' , cellNumb : 6},
  {id : 'sample&&bs' , cellNumb : 7},
]


export default function Avenue() {
  const [items, setItems] = useState(SAMPLES)
  const [editMode, setEditMode] = useState(true)
  const [grid, setGrid] = useState();
  const [ selected , setSelected] = useState();
  const canvasRef = useRef ();

  console.log('reload')

  useEffect(()=>{
    if(!grid) return;
    setItems( _items =>{
      return _items.map( _item =>{
        const cellNumb = _item.cellNumb;
        const transform = grid[cellNumb];
        return {..._item, ...transform};
      })
    })
  },[grid, items.length ])



  const onEnterNewCell= i =>{

    if( editMode && selected ){
      const transform = grid[i];
      setItems(_arr =>{
        const copied = [..._arr];
        copied[selected] = {...copied[selected],  cellNumb : i , ...transform  }
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

  const AddNewHouse = (newProperty)=>{
    setItems(_arr=> [..._arr, newProperty])
    setSelected( items.length )
    setEditMode(true)
  }


  return (
    <>
    <Canvas camera={{ fov: 20}} style={{width:'100vw', height:'100vh'}}  >

        <CameraControls position={new Vector3(-35,  25 ,-15)} target={new Vector3(-7  , 0 , 5)} />
        <Pixelate size={3} />    

        <Sky />
        <TerrainMesh editMode={editMode} setGrids={setGrid} onEnterNewCell={onEnterNewCell}   onClick={()=>{setSelected() }} />
        {items.map( (item,i) =>
          <House key={i} id={item.id} transform={{ position : item.position, rotation: item.rotation }}
                detailWindowOpen={!editMode}
                onUpdateProperty={(x)=>{onHouseUpdate(x,i)}}
                onClick={()=>{setSelected(i) }} />
        )}
        <Ocean />
    </Canvas>

    <div className='fixed z-[1] bottom-1 right-0  lg:m-3 gap-1 flex flex-col' >
      <div className='bg-[#748060] lg:text-[150%] px-1 py-1 lg:px-4 lg:py-2 border-4 border-black '>
        <Clock />
      </div>
      <div className='flex max-w-full gap-0 lg:gap-1 '>
        <Buttons.InfoButton />
        <Buttons.SkipBackwardButton /><Buttons.SkipForwardButton /> <Buttons.FastForwardButton />
        <Buttons.TimeShiftButton />
        <Buttons.RecordButton canvasRef={canvasRef} />

        <Buttons.EditModeButton editMode={editMode} setEditMode={setEditMode}/>
        <Buttons.AddNewHouseButton onAddNew={AddNewHouse} currentIds={items.map(item=> item.id )} />
        <Buttons.ReloadButton onClick={()=>{ setItems(x=>[...x] )}} /> {/* todos : Reload needs more works */}
      </div>
    </div>
    </>)

}

