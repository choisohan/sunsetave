import React, { useEffect, useState } from 'react'
import {Clock} from './Clock'
import PopupWindow from './PopupWindow'



export default function HouseDetailWindow(props) {
  
  const Header=() => {
    if(!props.property) return; 
    return <div className='w-full h-auto'>
      <span style={{display:'ruby'}} >
      <a href={`/${props.property.id}`}>
        <img src='/images/userProfile.png' className='w-[100px]'/>
      </a>
      <h3>{props.property.name}</h3>
      </span>

      <div className='bg-[#748060] p-1 m-1 w-fit border-4 border-black' >
      <Clock timezone={props.property.timezone}/>
      {props.property.timezone}
      </div>
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
