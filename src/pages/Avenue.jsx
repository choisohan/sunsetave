import React, {  useEffect, useState } from 'react'
import House from '../components/House'
import { Canvas } from '@react-three/fiber'
import Sky from '../components/Sky'
import {Pixelate} from '../shaders/CustomPostProcessing'
import TerrainMesh from '../components/TerrainMesh'
import HouseDetailWindow from '../components/HouseDetailWindow'
import * as Buttons from '../components/Buttons'
import {Clock} from '../components/Clock'
import Ocean from '../components/Ocean'
import { OrbitControls } from '@react-three/drei'

export default function Avenue() {

  const [items, setItems] = useState([
    {id : 'sample&&SampleCalendar' , cellNumb : 0  },
   {id : 'sample&&Mozart' , cellNumb : 1 },   
  ])

  const [selectedItem, setSelectedItem] = useState();
  const [editMode, setEditMode] = useState(false)
  const [grid, setGrid] = useState();
  const [popup, setPopup] = useState();


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


  const onHouseClicked=(_i, _detailProperty)=>{

    const thisItem = {..._detailProperty, i: _i} 
    setSelectedItem(thisItem)  ;

    if(!editMode){
      setPopup( <HouseDetailWindow property={thisItem}
        onClose={()=>{
          setSelectedItem(null);
          setPopup(null);
      }}/> );
    }
  }

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

  /*
  const ShuffleStreet=()=>{

    const count = 7; //Math.floor(Math.random() * Object.keys(SampleCalendars).length) + 1;
    
    const randomItems = Object.keys(SampleCalendars).sort(() => Math.random() - 0.5).slice(0, count).map(key=>({
        id: 'sample&&'+key , cellNumb: Math.floor( Math.random() * grid.length )
    }))

    setItems(randomItems)
    setGrid(arr=>[...arr])

  }
    */ 

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
    <Canvas camera={{position: [-20,7 ,10], fov: 20}} style={{width:'100vw', height:'100vh'}}  >

    <Pixelate />
    <OrbitControls target={[8,1,-8 ]} />

      <Sky />
        <TerrainMesh editMode={editMode} setGrids={setGrid} onEnterNewCell={onEnterNewCell} onClick={()=>{setSelectedItem()}} />
        {items.map( (item,i) =>
        <House key={i} property ={item} onUpdateProperty={(x)=>{onHouseUpdate(x,i)}}  onClick={_props=>{  onHouseClicked(i, _props )  }} />
    )}
    <Ocean />



  
     
    </Canvas>
   <div className='fixed z-[1] top-0 left-0  m-1 lg:m-6' >
      <div className='bg-[#748060] lg:text-[150%] px-1 py-1 lg:px-4 lg:py-2 border-4 border-black '>
        <Clock />
        </div>
  </div>

    <div className='fixed z-[1] bottom-1 right-0  flex  max-w-full gap-0 lg:gap-1 m-0 lg:m-6 ' >
      <Buttons.InfoButton />
      <Buttons.SkipBackwardButton /><Buttons.SkipForwardButton /> <Buttons.FastForwardButton />
      <Buttons.EditModeButton editMode={editMode} setEditMode={setEditMode}/>
      <Buttons.AddNewHouseButton onAddNew={AddNewHouse} currentIds={items.map(item=> item.id )} />
      
      <Buttons.ReloadButton onClick={()=>{ setItems(x=>[...x] )}} /> {/* todos : Reload needs more works */}

    </div>


    {popup}



    </>)

}


