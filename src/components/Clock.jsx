import React ,  { useState, useEffect }  from 'react'
import moment from 'moment-timezone';
import { useTimestamp , useUpdateTimestamp } from '../contexts/envContext';


export function Clock(props){
    const [timezone, setTimezone] = useState( props.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone )
    const timestamp = useTimestamp();
    const updateTimestamp = useUpdateTimestamp();

    useEffect(() => {

      const interval = setInterval(() => {
          updateTimestamp( new Date().getTime() );
      }, 60000);

      return () => clearInterval(interval);
    }, []);
  

    return <div>{ moment(timestamp).tz(timezone).format('MMM D YYYY ddd hh:mm A') }</div>;
};
  

export function timestampToHourFloat(_timestamp){
  const date = new Date(_timestamp);
  const hours = date.getHours();
  return hours/24; 
}
