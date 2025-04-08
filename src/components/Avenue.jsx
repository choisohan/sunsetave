import React, {  useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import Sky from './Sky'
import {Pixelate} from '../shaders/CustomPostProcessing'
import CameraControls from './CameraControls'
import TerrainMesh from './TerrainMesh'
import HouseDetailWindow from './HouseDetailWindow'
import { AddNewHouseButton, EditModeButton, FastForwardButton , ReloadButton, SkipBackwardButton, SkipForwardButton, TimeTestButton} from './Buttons'
import {Clock} from './Clock'
import { OrbitControls } from '@react-three/drei'
import Ocean from './Ocean'



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
  const [focusPosition, setFocusPosition] = useState()


  useEffect(()=>{
    if(!grid) return;

    setItems( _items =>{
      return _items.map( _item =>{
        const cellNumb = _item.cellNumb;
        const transform = grid[cellNumb];
       return {..._item, ...transform};
      })
    })
  },[grid])

  const onMouseMoveOnGrid= (cellNumb)=>{
    if(!selectedItem) return;

    const transforms = grid[cellNumb]
    
    setItems(_items =>{
      const itemArr = [..._items];
      itemArr[selectedItem.i] = {...itemArr[selectedItem.i], position: transforms.position ,rotation: transforms.rotation }
      return itemArr; 
    })
  }

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
      //const [position, rotation] = getTransformByCellNumb(i);


      const transform = grid[i];


      console.log( i , selectedItem  , transform )


      setItems(_arr =>{
        _arr[selectedItem.i] = {..._arr[selectedItem.i],  cellNumb : i , ...transform  }
        return _arr; 
      })

      setSelectedItem( item=>({...item, cellNumb : i ,...transform }))
    }
  }


  return (
    <>
    <Canvas camera={{position: [-20,7 ,10], fov: 20}} style={{width:'100vw', height:'100vh'}}  >

    <Pixelate />

    <OrbitControls target={[8,1,-8 ]}/>
      <Sky />
        <TerrainMesh editMode={editMode} setGrids={setGrid} onEnterNewCell={onEnterNewCell} onClick={()=>{setSelectedItem()}} />
        {items.map( (item,i) =>
        <House key={i} property ={item} onClick={_props=>{  onHouseClicked(i, _props )  }} />
    )}


<Ocean />



  
     
    </Canvas>

    <div className='fixed z-[1] bottom-0 right-0 ' >
      <div className='bg-white'><Clock /></div>
      <TimeTestButton />
      <SkipBackwardButton /><SkipForwardButton /> <FastForwardButton />
      <ReloadButton onClick={()=>{ setItems(x=>[...x] )}} /> {/* todos : Reload needs more works */}
      <AddNewHouseButton />
      <EditModeButton editMode={editMode} setEditMode={setEditMode}/>
    </div>


    {popup}




    </>)

}


