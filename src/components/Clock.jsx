import React ,  { useState, useEffect }  from 'react'
import moment from 'moment-timezone';


const updateTime = (timezone)=>{
  
    return moment().tz(timezone).format('hh:mm A');
}

export default function Clock(props){
    const [timezone, setTimezone] = useState( props.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone )
    const [timeMoment, setTimemoment] = useState();
    const [timestemp,setTimeStemp] = useState( Date.now() )

    useEffect(() => {
      const interval = setInterval(() => {
        setTimeStemp(Date.now());
      }, 60000); // 60000ms = 1 minute
      // Cleanup the interval when the component is unmounted
      return () => clearInterval(interval);
    }, []);
  

    return <div>{moment(timestemp).tz(timezone).format('hh:mm A')}</div>;
};
  