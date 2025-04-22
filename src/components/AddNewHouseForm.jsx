import React, { useRef, useState } from 'react'
import PopupWindow from './PopupWindow'
import { CozyButton } from './Buttons';
import House from './House';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Pixelate } from '../shaders/CustomPostProcessing';
import { FindCalendar } from '../calendar/FetchCalendar';

export default function AddNewHouseForm(props) {

    const icalInput = useRef();
    const [ property, setProperty ] = useState(null);
    const [ msg , setMsg ] = useState() 


    const Search = ()=>{
      const icalURL = icalInput.current.value;
      const currentIds =  props.currentIds|| [] ;
      if(currentIds.includes(icalURL)){
        setMsg("This house exists in your avenue already.")
      }
      else{
        FindCalendar(icalURL).then( calendar =>{
          const newProperty = {...property, ...props.property , ...calendar, id: icalURL   }; 
          newProperty.position = new Vector3(0,-1,0);
          setProperty(newProperty);
        }).catch(err =>{
          setMsg("Invalid Ical ID. Check it again.");
        })
      }
    }

  return (
    <PopupWindow isOpened={true} setIsOpened={()=>{props.onClose()}} >


      <h3 className='flex pt-5' >Add a new house to my avenue</h3>


      <div className='flex pt-5'>
        <input
          type="text"
          ref = {icalInput}
          className="w-full border-2 border-gray-300 p-2 rounded-lg"
          placeholder="https://calendar.google.com/calendar/ical/......ics"
          required
        />
        <CozyButton className='pixelButton' onClick={Search}><div>Search</div></CozyButton>

      </div>


      <div className='pt-10  flex flex-col self-center gap-2 justify-center items-center'>
        { property ?
<>
      <Canvas camera={{position: [-0, 0 ,10], fov: 15 }} style={{width:'200px', height: '200px' }} >
        <Pixelate />
        <House property={ property }  onClick={()=>{}} onMouseEnter={()=>{}} />
      </Canvas>
        <CozyButton className='pixelButton' onClick={()=>{props.onAddNew(property)}} ><div>Add to My Avenue</div></CozyButton>

  </> :
        <div>{msg}</div>}
      </div>

    </PopupWindow>
  )
}
