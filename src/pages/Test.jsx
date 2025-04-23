import { useRef, useState } from "react"
import HouseBuilder from '../components/HouseBuilder';
import { CozyButton } from "../components/Buttons";

export default function Test() {

  const icalInput = useRef();
  const [id, setId]= useState('')


  const onClick = ()=>{
    const url = 'https://calendar.google.com/calendar/ical/8c063daee6e0ebb0eac75293727a2b85d9024b26c96fd2ad4f9a7489bbf835a1%40group.calendar.google.com/public/basic.ics'
    //https://calendar.google.com/calendar/ical/${icalUrl}%40group.calendar.google.com/public/basic.ics

    const match = url.match(/ical\/(.*?)%40/);
    const calendarId = match ? match[1] : null;
        setId(calendarId)
  }

  return <div className="h-screen w-screen bg-yellow-200">

    <div className="flex">
    <input type="text"
          ref = {icalInput}
          className="w-full border-2 border-gray-300 p-2 rounded-lg"
          placeholder="https://calendar.google.com/calendar/ical/......ics"          
          required
        />
        <CozyButton className='pixelButton' onClick={onClick}>Search</CozyButton>


    </div>
        
      <HouseBuilder id={id} timeout='infinite' />
  </div>

}


