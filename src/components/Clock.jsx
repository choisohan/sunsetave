import React ,  { useState, useEffect }  from 'react'
import moment from 'moment-timezone';
import { useTimestamp , useUpdateTimestamp } from '../contexts/envContext';
import { useTimezoneOverride } from '../contexts/envContext';




export const GetColorByTZ = (timezone) =>{

  const dict = {
    "Africa" : '#cf6400',
    "America" :"#a83232",
    "Antarctica":"#357bbd",
    "Arctic":"#357bbd",
    "Asia":"#c27b00",
    "Atlantic":"#0800ff",
    "Australia":"#0800ff",
    "Europe":"#126e39",
    "Indian":"#f5761b",
    "Pacific":"#2e66c7",
    "Etc":"#58585c",
    "UTC":"#58585c"
  }
  return dict[ timezone.split('/')[0] ]
}

export function Clock(props){
    const [timezone, setTimezone] = useState( props.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone )
    const timezoneOverride = useTimezoneOverride(); 
    const timestamp = useTimestamp();
    const updateTimestamp = useUpdateTimestamp();

    useEffect(()=>{
      if(!props.timezone) return; 
      if(timezoneOverride)setTimezone(timezoneOverride);
      else setTimezone(props.timezone); 
    },[timezoneOverride , props.timezone])
    
    useEffect(() => {

      const interval = setInterval(() => {
          updateTimestamp( new Date().getTime() );
      }, 60000);

      return () => clearInterval(interval);
    }, [updateTimestamp]);
  

    return <div>
      <span className='text-black'>{ moment.tz(timestamp, timezone).format('MMM D ddd ') } </span>
    
    <span className='text-white' > 
    { moment.tz(timestamp, timezone).format('hh:mm A') }
    </span>
    </div>
   ;
};
  

export function timestampToHourFloat(_timestamp , _timezone){
 var tz = _timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return moment(_timestamp).tz(tz).hours()/24; 
}
// style={{color: GetColorByTZ(property.timezone)}}