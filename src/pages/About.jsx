import React from 'react'
import HouseViewer from './HouseViewer'
import * as Buttons from '../components/Buttons'
import StepByStep from '../components/StepByStep';
import QnA from '../components/QnA';


export default function About() {


  return (
    <div id='about-page'>
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
<HouseViewer className='w-[300px] !h-[600px] ' id='sample&&nz'/>
<HouseViewer className='w-[300px] !h-[600px] ' id='sample&&tokyo'/>
</div>

<div className='flex column lg:gap-1 lg:p-2 w-full hideOnSmall place-content-center '>
  Try it→ 
  <Buttons.SkipBackwardButton />
  <Buttons.SkipForwardButton />
  <Buttons.FastForwardButton />

</div>


<br /><br /><br /><br />

<div>
  <h2>Ready to create your own? </h2>
  <h3>No Need to sign up.</h3>
  <h3>All you need is your google calendar URL</h3>

</div>
<br /><br /><br /><br />
<StepByStep />

<QnA />


    </div>
  )
}


