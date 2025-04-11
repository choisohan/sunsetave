import React, {  useEffect, useState } from 'react'
import House from '../components/House'
import { Canvas } from '@react-three/fiber'
import Sky from '../components/Sky'
import {Pixelate} from '../shaders/CustomPostProcessing'
import TerrainMesh from '../components/TerrainMesh'
import HouseDetailWindow from '../components/HouseDetailWindow'
import { AddNewHouseButton, EditModeButton, FastForwardButton , InfoButton, ReloadButton, SkipBackwardButton, SkipForwardButton} from '../components/Buttons'
import {Clock} from '../components/Clock'
import { OrbitControls } from '@react-three/drei'
import Ocean from '../components/Ocean'
import { CozyButton } from '../components/Buttons'
import { SampleCalendars } from '../calendar/SampleCalendars'

export default function Avenue() {

  const [items, setItems] = useState([
    {id : 'sample&&SampleCalendar' , cellNumb : 0  },
   {id : 'sample&&BruceLee' , cellNumb : 1 },   
   {id : 'sample&&Einstein' ,  cellNumb : 2},
   {id : 'sample&&Darwin' ,  cellNumb : 3},
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

  const ShuffleStreet=()=>{

    const count = 7; //Math.floor(Math.random() * Object.keys(SampleCalendars).length) + 1;
    
    const randomItems = Object.keys(SampleCalendars).sort(() => Math.random() - 0.5).slice(0, count).map(key=>({
        id: 'sample&&'+key , cellNumb: Math.floor( Math.random() * grid.length )
    }))

    setItems(randomItems)
    setGrid(arr=>[...arr])

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
    <Canvas camera={{position: [-20,7 ,10], fov: 20}} style={{width:'100vw', height:'100vh'}}  >

    <Pixelate />

    <OrbitControls target={[8,1,-8 ]}/>
      <Sky />
        <TerrainMesh editMode={editMode} setGrids={setGrid} onEnterNewCell={onEnterNewCell} onClick={()=>{setSelectedItem()}} />
        {items.map( (item,i) =>
        <House key={i} property ={item} onUpdateProperty={(x)=>{onHouseUpdate(x,i)}}  onClick={_props=>{  onHouseClicked(i, _props )  }} />
    )}
    <Ocean />



  
     
    </Canvas>
   <div className='fixed z-[1] bottom-0 left-0  m-[20px]' >
      <div className='bg-[#748060] text-[150%] p-[10px] border-4 border-black'><Clock /></div>
  </div>

    <div className='fixed z-[1] bottom-0 right-0 m-[10px] flex gap-[5px]' >
    <InfoButton />

      <SkipBackwardButton /><SkipForwardButton /> <FastForwardButton />
      <ReloadButton onClick={()=>{ setItems(x=>[...x] )}} /> {/* todos : Reload needs more works */}
      <AddNewHouseButton onAddNew={AddNewHouse} currentIds={items.map(item=> item.id )} />
      <EditModeButton editMode={editMode} setEditMode={setEditMode}/>
      <CozyButton  className='pixelButton'  tooltip="Suffle Avenue" onClick={ShuffleStreet}><img src='/images/game_die.png' alt='shuffle'/>    </CozyButton>
    </div>


    {popup}



    </>)

}


