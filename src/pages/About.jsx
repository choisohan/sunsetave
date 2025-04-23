import React from 'react'
import HouseBuilder from '../components/HouseBuilder'
import '../styles/about.css'
import HouseViewer from './HouseViewer'
import * as Buttons from '../components/Buttons'

export default function About() {

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
        
        </div>


        <h3 className='font-bold scale-[150%]' >House Builder</h3>
        <HouseBuilder />

        <div>
          1. Design your house and copy this code.<br />
          2. Paste this code to your google calendar's description<br />
          3. Turn it to the public and copy and paste your ical URL here<br />
        </div>
    </div>
  )
}


