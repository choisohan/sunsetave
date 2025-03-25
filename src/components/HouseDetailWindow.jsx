import React, { useEffect } from 'react'
import Clock from './Clock'




export default function HouseDetailWindow(props) {


  useEffect(()=>{
    console.log(props )
  },[props ])



  const onClickDiv = (e)=>{
    if(e.target.className === 'fullscreen'){
      props.onClose()
    }
  }

  const Header=() => {
    if(!props.property) return; 
    return <div className='w-full h-auto'>
    <h3>{props.property.name}</h3>
    <Clock timezone={props.property.timezone}/>
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
      <div className='w-full h-full bg-black fixed top-0 left-0 bg-opacity-50 place-content-center place-items-center' onClick={onClickDiv} >

        <div className='relative flex flex-col bg-white border-solid border-4 border-black min-w-[550px] min-h-[400px] p-4' style={{zIndex:1000}}>
          <button className='absolute top-0 right-0' onClick={()=>{props.onClose()}}>Close</button>

          {Header()}
          {CurrentEvent()}
          {NextEvent()}

        </div>
      </div>

    )
  }

}
