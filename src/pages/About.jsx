import React ,{useRef, useState} from 'react'
import HouseBuilder from '../components/HouseBuilder'
import '../styles/about.css'
import HouseViewer from './HouseViewer'
import * as Buttons from '../components/Buttons'
import { CozyButton } from '../components/Buttons'



export default function About() {



  const icalInput = useRef();
  const [id, setId]= useState('')


  const onClick = ()=>{
    const url = 'https://calendar.google.com/calendar/ical/8c063daee6e0ebb0eac75293727a2b85d9024b26c96fd2ad4f9a7489bbf835a1%40group.calendar.google.com/public/basic.ics'
    //https://calendar.google.com/calendar/ical/${icalUrl}%40group.calendar.google.com/public/basic.ics

    const match = url.match(/ical\/(.*?)%40/);
    const calendarId = match ? match[1] : null;
        setId(calendarId)
  }

  return (
    <div className='about'>
<div className="flex items-center gap-2">
  <a href='/'><img src="/images/houseButton.png" className="w-[100px]" alt="sunave" /></a>
  <h1 className="font-bold">Sunset Ave.</h1>
</div>


<div className='leading-tight'>
    <h2>Turn your calendar </h2>
    <h2>into an interactive 3D house</h2>
</div>
<div className="flex">
<HouseViewer className='w-[300px] !h-[600px] ' id='sample&&paris'/>
<HouseViewer className='w-[300px] !h-[600px] ' id='sample&&ny'/>
<HouseViewer className='w-[300px] !h-[600px] ' id='sample&&hoian'/>
<HouseViewer className='w-[300px] !h-[600px] ' id='sample&&tokyo'/>
</div>
<div className='flex column lg:gap-1 lg:p-2 w-full hideOnSmall place-content-center '>
  <Buttons.SkipBackwardButton />
  <Buttons.SkipForwardButton />
  <Buttons.FastForwardButton />

</div>






        <br /><br /><br /><br />

        <div>
          <h3>Ready to create your own? </h3>
          <h3>No Need to sign up.</h3>
          <h3>All you need is your google calendar URL</h3>

        </div>
        <br /><br /><br /><br />


        <h3 className='font-bold scale-[150%]' >Step By Step</h3>


        <div className='text-2xl	leading-loose	'>
          1. Go to Google Calendar and click setting<br />
          2. Make it public and save <br />
          3 Copy Ical URL and paste here<br />
        </div>

        <div className="flex w-full max-w-[650px]">
          <input type="text" class
                ref = {icalInput}
                className="w-full border-2 border-gray-300 p-1 rounded-lg"
                placeholder="https://calendar.google.com/calendar/ical/......ics"          
                required
              />
          <CozyButton className='pixelButton' onClick={onClick}>Search</CozyButton>
        </div>




        <HouseBuilder id={id} timeout='infinite leading-loose	' />

        <div className='text-2xl	'>
          4. Design your house<br />
          5. Copy and paste this code at the end of the description. <br />
          6. save the calendar once again.<br />
        </div>

    </div>
  )
}


