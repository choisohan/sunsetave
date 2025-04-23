import React, { useEffect, useRef, useState } from 'react'
import {Clock} from './Clock'
import PopupWindow from './PopupWindow'
import { getCurrentEventIndex } from '../calendar/SortEvents'
import moment from 'moment-timezone'


export default function HouseDetailWindow(props) {
  
  const currentIndex = useRef(getCurrentEventIndex(props.property.events)); 
   

  if(!props.property) return null; 
  return (
    <PopupWindow isOpened={true} setIsOpened={()=>{props.onClose()}} >
      <Header id={props.property.id} name={props.property.name} timezone={props.property.timezone}/>
      <CurrentEvent event={props.property.events[currentIndex.current]}/>
      <NextEvent event={props.property.events[currentIndex.current+1]}/>
    </PopupWindow>
  )
  

}


const Header = ({id , name , timezone} )=>{
    return <div className='w-full h-auto'>
    <span style={{display:'ruby'}} >
    <a href={`/${id}`}>
      <img src='/images/userProfile.png' className='hidden w-[50px]' alt='profile'/>
      <h3>{name}</h3>

    </a>
    </span>

    <div className='bg-[#748060] px-1 m-1 w-fit border-4 border-black' >
      <Clock timezone={timezone}/>{timezone}
    </div>
  </div>
}

const CurrentEvent=({event}) => {
  if(!event) return; 
  return <div className='flex-1 bg-gray-200 overflow-y-auto p-2'>
    <h3> { event.summary }</h3>
    <span> { event.description }</span>
  </div>
}

const NextEvent = ({event})=>{

  const [hourDiffString, setTimeDiffString] = useState('');

  useEffect(()=>{
    const diff = event.startMoment.diff( moment() )
    const duration = moment.duration(Math.abs(diff));

    let unit = 'seconds';
    let value = Math.floor(duration.asSeconds());
  
    if (duration.asMinutes() >= 1) {
      unit = 'minutes';
      value = Math.floor(duration.asMinutes());
    }
    if (duration.asHours() >= 1) {
      unit = 'hours';
      value = Math.floor(duration.asHours());
    }
    if (duration.asDays() >= 1) {
      unit = 'days';
      value = Math.floor(duration.asDays());
    }
  
    const suffix = diff >= 0 ? 'later' : 'ago';

    if (value === 0) setTimeDiffString('just now');
    setTimeDiffString(`${value} ${unit} ${suffix}`);

  },[event.startMoment])

  return <div className='text-right'> "{event.summary}" starts {hourDiffString}</div>
  
}

