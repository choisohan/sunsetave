import React, { useEffect, useRef , useState} from 'react'
import { getCurrentEventIndex } from '../calendar/SortEvents';
import moment from 'moment-timezone';
import { useTimestamp } from '../contexts/envContext';

export const EventTable = ({events})=>{
    const [currentEventIndex, setCurrentEventIndex] = useState(null);
    const [nextEventIndex, setNextEventIndex] = useState();
    const parentDivRef = useRef(null);
    const timestamp = useTimestamp();
  

    useEffect(()=>{
        if(!events || events.length < 1) return;

        const _currentIndex = getCurrentEventIndex( events ,timestamp ); 
        setNextEventIndex(_currentIndex+1);
    
        const _currentEvent = events[_currentIndex];
        if( new moment(timestamp).isBetween(_currentEvent.startMoment, _currentEvent.endMoment ) ) setCurrentEventIndex(_currentIndex);  

    },[events, timestamp])

  
    useEffect(()=>{
        if(!nextEventIndex) return;
        const itemToScroll = parentDivRef.current.querySelector('.nextEvent');
        if (itemToScroll) {
            itemToScroll.previousElementSibling.scrollIntoView({ behavior: 'smooth' });
        }
    },[nextEventIndex] )
  
    const bgColor =(i)=>{
      if(i=== currentEventIndex)return 'bg-gray-200';
     // if(i=== nextEventIndex)return 'bg-blue-100';
    }

    const opacity =(i) =>{
        if(i < nextEventIndex-1) return 'opacity-20'
    }
  
    if(!events) return; 
    return <>


    
    <div className='hideOnSmall w-full h-[400px]'>
        {currentEventIndex ?
    <>
    <h3>{events[currentEventIndex].summary}</h3>
    <span className='overflow-y-scroll'>{events[currentEventIndex].description}</span>

    </>:null    
    }
      
    </div>



    <div ref={parentDivRef} className='p-1 m-1 border-2 border-black overflow-auto min-h-[100px] h-[100px] lg:h-full hideOnSmall'>
    {events.map((evt, i)=>
        <div key={i} className={`flex cursor-pointer hover:bg-gray-200 ${bgColor(i)} ${opacity(i)} ${nextEventIndex=== i ? 'nextEvent' :'' }`}>
          <span style={{width:'200px'}}>{evt.startMoment.format("MM/DD hh:mm A")}</span>
          <span>{evt.summary}</span>
        </div>
    )}
    </div>
    
    
    </>
  }