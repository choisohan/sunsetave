import React ,  { useState, useEffect }  from 'react'
import moment from 'moment-timezone';
import { useTimestamp , useUpdateTimestamp } from '../contexts/envContext';


export function Clock(props){
    const [timezone, setTimezone] = useState( props.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone )
    const timestamp = useTimestamp();
    const updateTimestamp = useUpdateTimestamp();

    useEffect(()=>{
      setTimezone(props.timezone); 
    },[props.timezone])
    
    useEffect(() => {

      const interval = setInterval(() => {
          updateTimestamp( new Date().getTime() );
      }, 60000);

      return () => clearInterval(interval);
    }, []);
  

    return <div>{ moment.tz(timestamp, timezone).format('MMM D YYYY ddd hh:mm A') }</div>;
};
  

export function timestampToHourFloat(_timestamp , _timezone){
 var tz = _timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return moment(_timestamp).tz(tz).hours()/24; 
}
