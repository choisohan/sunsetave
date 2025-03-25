import React ,  { useState, useEffect }  from 'react'
import moment from 'moment-timezone';


const updateTime = (timezone)=>{
    return moment().tz(timezone).format('hh:mm A');
}

export default function Clock(props){
    const [time, setTime] = useState( updateTime(props.timezone));
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTime( updateTime(props.timezone));
      }, 60000); // 60000ms = 1 minute
  
      // Cleanup the interval when the component is unmounted
      return () => clearInterval(interval);
    }, []);
  
    return <div>{time}</div>;
};
  