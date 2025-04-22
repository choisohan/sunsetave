import React from 'react'
import HouseBuilder from '../components/HouseBuilder'
import '../styles/about.css'
import HouseViewer from './HouseViewer'


export default function About() {

  return (
    <div className='about'>
        <img src='/images/houseButton.png' className='w-[100px]' alt='sunave' />
        <h1 className='font-bold'>Sunset Ave.</h1>
        <div>
        <h2>Turn your calendar into a house</h2>
        <h2 className='font-bold'>iCal Renderer</h2>
        </div>


<div>
<HouseViewer className='w-[300px] h-[600px] ' id='sample&&paris'/>
<HouseViewer className='w-[300px] h-[600px] ' id='sample&&tokyo'/>
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


