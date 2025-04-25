import React,{useRef, useState} from 'react'
import HouseBuilder, { HouseCodeOutput } from './HouseBuilder'
import { CozyButton } from './Buttons'


const SearchButton = ()=>{
  return 
}
export default function StepByStep() {

  const icalInput = useRef();
  const [id, setId]= useState('')
  const [property,setProperty] = useState();
  const [steps,setSteps] = useState(0);


  const onClick = ()=>{
    const url = icalInput.current.value;
    const match = url.match(/ical\/(.*?)%40/);
    const calendarId = match ? match[1] : null;
    if(calendarId){
      setId(calendarId)
    }
  }


  return (
    <div className='max-w-[800px]'>
    <h2 className='font-bold' >Step By Step</h2>


    <div className='text-2xl	leading-loose	'>
      1. Go to Google Calendar and click setting<br />
      2. turn on "Make available to public" save (important!) <br />
      3  Copy and paste "PUBLIC ADDRESS IN ICAL FORMAT"<br />
    </div>

    <div className="mb-20 flex w-full max-w-[650px] place-self-center">
      <input type="text"  ref = {icalInput}
            className="w-full border-2 border-gray-300 p-1 rounded-lg"
            placeholder="https://calendar.google.com/calendar/ical/......ics"          
            required
          />
      <CozyButton className='pixelButton' onClick={onClick}>Search</CozyButton>
    </div>





    <div className={`mb-20 ${steps <4? "h-0 overflow-hidden":""}`}>
        
        <div className='text-2xl leading-loose	'>
        4. Design your house<br />
        </div>

  <div className='place-items-center'>
    <HouseBuilder id={id} timeout='infinite'
                            onUpdateProperty={setProperty} onValidHouse={()=>{setSteps(4)}} />

            <CozyButton className='pixelButton' onClick={()=>{setSteps(5)}}>I like it. Next</CozyButton>
</div>


    </div>



    <div className={`mb-20 ${steps < 5? "h-0 overflow-hidden":""}`}>
        <div className='text-2xl 	'>
            5. Copy and paste this code at the end of the description. <br />
        </div>

<div className='place-items-center mb-10'>
            <HouseCodeOutput property={property} />

</div>

        <div className='text-2xl leading-loose	'>
        6. Complete! I told you it's simple<br />
        <a href={'/'+id}>
        <CozyButton className='pixelButton'>Enter</CozyButton>
        </a>
        </div>
    </div>
        

</div>
  )
}
