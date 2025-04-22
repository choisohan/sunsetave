import React, {  useEffect, useState } from 'react'
import House from '../components/House'
import { Canvas } from '@react-three/fiber'
import Sky from '../components/Sky'
import {Pixelate} from '../shaders/CustomPostProcessing'
import TerrainMesh from '../components/TerrainMesh'
import * as Buttons from '../components/Buttons'
import {Clock} from '../components/Clock'
import Ocean from '../components/Ocean'
import CameraControls from '../components/CameraControls'
import { usePopup } from '../contexts/PopupContext'




export default function Avenue() {
  const [items, setItems] = useState([

    {id : 'sample&&paris' , cellNumb : 0  },
   {id : 'sample&&tokyo' , cellNumb : 1 },   
   {id : 'sample&&ny' , cellNumb : 2 },
   {id : 'sample&&hoian' , cellNumb : 3},

  ])

  const [selectedItem, setSelectedItem] = useState();
  const [editMode, setEditMode] = useState(false)
  const [grid, setGrid] = useState();
  const popupContext = usePopup()


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
    if(editMode && selectedItem){
      const transform = grid[i];
      setItems(_arr =>{
        _arr[selectedItem.i] = {..._arr[selectedItem.i],  cellNumb : i , ...transform  }
        return _arr; 
      })
      setSelectedItem( item=>({...item, cellNumb : i ,...transform }))
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
    setSelectedItem({...newProperty , i : items.length });
    setEditMode(true)
  }


  return (
    <>
    <Canvas camera={{position: [-35,  25 ,-15], fov: 20}} style={{width:'100vw', height:'100vh'}}  >
        <CameraControls target={[-7  , 0 , 5 ]} />
        <Pixelate size={3} />    

        <Sky />
        <TerrainMesh editMode={editMode} setGrids={setGrid} onEnterNewCell={onEnterNewCell} onClick={()=>{setSelectedItem()}} />
        {items.map( (item,i) =>
          <House key={i} property ={item} detailWindowOpen={!editMode} onUpdateProperty={(x)=>{onHouseUpdate(x,i)}}  onClick={()=>{setSelectedItem({i: i})}} />
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
        <Buttons.EditModeButton editMode={editMode} setEditMode={setEditMode}/>
        <Buttons.AddNewHouseButton onAddNew={AddNewHouse} currentIds={items.map(item=> item.id )} />
        <Buttons.ReloadButton onClick={()=>{ setItems(x=>[...x] )}} /> {/* todos : Reload needs more works */}
      </div>
    </div>
    {popupContext}
    </>)

}

