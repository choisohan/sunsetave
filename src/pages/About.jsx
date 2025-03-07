import React from 'react'
import HouseBuilder from '../components/HouseBuilder'
import '../styles/about.css'

export default function About() {
  return (
    <div className='about'>
        <h1>Sunset Ave.</h1>
        <div>
        <h2>Turn your Calendar into House/Shop.</h2>
        <h3>New iCal Renderer that you've never ever seen.</h3>
        </div>


        <br /><br /><br /><br />
        <div>
        <h3>Ready to create your own? </h3>
        <h3>No Need to sign up.</h3>
        </div>


        <h2>House Builder</h2>
        <HouseBuilder />

        <div>
          1. Design your house and copy this code.<br />
          2. Paste this code to your google calendar's description<br />
          3. Turn it to the public and copy and paste your ical URL here<br />
        </div>
    </div>
  )
}
