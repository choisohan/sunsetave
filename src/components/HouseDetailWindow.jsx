import React, { useEffect } from 'react'
import {Clock} from './Clock'
import PopupWindow from './PopupWindow'



export default function HouseDetailWindow(props) {

  const Header=() => {
    if(!props.property) return; 
    return <div className='w-full h-auto'>
    <h3>{props.property.name}</h3>
    <Clock timezone={props.property.timezone}/>
    <h4>{props.property.timezone}</h4>
    </div>
  }



  const CurrentEvent=() => {
    if(!props.property) return; 
    return <div className='flex-1 bg-gray-200 overflow-y-auto'>Current Event</div>
  }



  const NextEvent = ()=>{

    if(!props.property) return; 
    return <div className='text-right'> "Next Event" Start in 3 Hours</div>
    
  }


  if(props.property) {
    return (
      <PopupWindow isOpened={true} setIsOpened={()=>{props.onClose()}} >
          {Header()}
          {CurrentEvent()}
          {NextEvent()}
      </PopupWindow>

    )
  }

}
