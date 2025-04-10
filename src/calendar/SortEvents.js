import { RRule } from "rrule";
import moment from "moment-timezone";


const WeekRange = ( tz , offset )=>{
    const nowMoment = moment().tz(tz || Intl.DateTimeFormat().resolvedOptions().timeZone);
    const lastMondayStart = nowMoment.clone().startOf('week').add(offset, 'week').add(1, 'day');
    const nextSundayEnd = lastMondayStart.clone().endOf('week').add(1, 'day');
    return {start: lastMondayStart, end: nextSundayEnd}
}


const DateFromNow = (days)=>{
    var date = new Date();
    date.setDate( new Date().getDate() + days );
    return date; 
}



export const GetDayArrayFromRRule = (event, _timezone)=>{
    var options =  RRule.fromString( event.rrule ).options;

    options.dtstart = new moment.tz(event.start, _timezone).toDate() ;
    // new Date(event.start);
    delete options.byhour;
    delete options.byminute;
    delete options.bysecond;
    delete options.byhour;
    delete options.bymonthday;
    delete options.bynmonthday;


    const rule = new RRule(options);
    const recentOccurrences = rule.between( DateFromNow(-3), DateFromNow(+3) , true);

    return recentOccurrences.map( date => {
        const minutes = moment(event.end).diff( moment(event.start) ,'minutes' );
        var start = moment(date).tz(_timezone)
        return { start : start , end : start.clone().add( minutes, 'minutes')  }
    })


}







export const SortCalendarData = async (_calendar)=>{
    // filter first
    const tz = _calendar.timezone;
    const weekRange = WeekRange(tz, 1);

    const events =  _calendar.events.filter(evt => moment(evt.start).isBefore(weekRange.end))
                                    .map(evt => ({...evt, days: GetDayArrayFromRRule(evt, tz) }) )
   
    var arr = [];
    const promises = events.map(evt =>
        new Promise((resolve,reject)=>{
            const newArrays = evt.days.map( day => {
                const _evt = {...evt, startMoment : day.start.tz(tz) , endMoment: day.end.tz(tz) }; //,start : day.start.toISOString(), end : day.end.toISOString() 
                delete _evt.days;
                return _evt;
            })
            arr = [...arr,...newArrays]
            resolve(true) ;
        }
    ))


    return {..._calendar, events: await Promise.all(promises).then( () =>{
        arr = arr.sort((a, b) =>  a.startMoment.diff(b.startMoment));

        return(arr);
    })}
}










export const getCurrentEventIndex = ( events, _timestamp )=>{
    
    const future = events.filter( evt =>
    evt.endMoment.isAfter( new moment(_timestamp) )
    )

   return Math.max(0, Math.min(  events.length -1 , events.length - future.length ))
      
}

