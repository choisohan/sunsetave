import React, { useRef, useState } from 'react'
import PopupWindow from './PopupWindow'
import { CozyButton } from './Buttons';
import House from './House';
import { Canvas } from '@react-three/fiber';
import { Pixelate } from '../shaders/CustomPostProcessing';
import { CameraLookAt } from './HouseBuilder';
export default function AddNewHouseForm(props) {

    const icalInput = useRef();
    const [ msg , setMsg ] = useState() 
    const [valid, setValid] = useState(false);
    const [id,setId] = useState();
    const [property , setProperty]= useState()

    const Search = ()=>{
      const currentIds =  props.currentIds|| [] ;

      const icalURL = icalInput.current.value;
      const match = icalURL.match(/ical\/(.*?)%40group/);



      if(match){
        const iCalID  = match[1];
        if(currentIds.includes(iCalID)){
          setMsg("This house exists in your avenue already.")
        }
        else{
          setId(iCalID);
          /*
          console.log( iCalID )
          FindCalendar(iCalID).then( calendar =>{
            console.log( calendar )
            const newProperty = {...property, ...props.property , ...calendar, id: iCalID   }; 
            newProperty.position = new Vector3(0,-1,0);
            setProperty(newProperty);
          }).catch(err =>{
            setMsg("Invalid Ical ID. Check it again.");
          })
            */ 
        }


      }else{
        setMsg("Invalid Ical ID. Check it again.");
      }

    }

  const itsValidHouse = (result)=>{
    console.log('result : ', result )
    setValid(result ? true : false);
    setProperty(result)
  }

  return (
    <PopupWindow>


      <h3 className='flex pt-5' >Search House</h3>


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
        { id ?
<>
      <Canvas camera={{position: [6,1,12], fov: 15 }} style={{width:'200px', height: '200px' }} >
        <Pixelate />
        <CameraLookAt />
        <House id={id} onUpdateProperty={itsValidHouse} />
        <mesh><boxGeometry args={[10,.1,10]} /></mesh>

      </Canvas>
        {valid ? <div className='w-full'>
          <span>{property.name}</span><br />
          <CozyButton className='pixelButton' onClick={()=>{props.onAddNew({id:id})}} ><div>Add to My Avenue</div></CozyButton>
        </div> : null}

  </> :
        <div>{msg}</div>}
      </div>

    </PopupWindow>
  )
}


const AvailableCalendars = ()=>{

  return <div>
    availableCalendars
  </div>
}