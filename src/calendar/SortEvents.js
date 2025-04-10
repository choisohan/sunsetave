import { RRule } from "rrule";
import moment from "moment-timezone";


const WeekRange = ( tz , offset )=>{
    const nowMoment = moment().tz(tz || Intl.DateTimeFormat().resolvedOptions().timeZone);
    const lastMondayStart = nowMoment.clone().startOf('week').add(offset, 'week').add(1, 'day');
    const nextSundayEnd = lastMondayStart.clone().endOf('week').add(1, 'day');
    return {start: lastMondayStart, end: nextSundayEnd}
}








export const GetDayArrayFromRRule = (event, _timezone)=>{
    const lastWeek = new Date();
    lastWeek.setDate(new Date().getDate() - 7);

    const rule =  RRule.fromString(event.rrule );
    rule.options.count = 10;  // todo :limit for performance
    rule.options.dtstart = lastWeek; 
    return rule.all().map( d=> {
        const minutes = moment(event.end).diff(moment(event.start),'minutes');
        var start = moment(d).tz(_timezone)
        return {start : start , end : start.clone().add( minutes, 'minutes')  }
    })

}







export const SortCalendarData = async (_calendar)=>{
    console.log('start sorting...', _calendar)
    // filter first
    const tz = _calendar.timezone;
    const weekRange = WeekRange(tz, 1);
    console.log( 'weekRange',weekRange )

    const events =  _calendar.events.filter(evt => moment(evt.start).isBefore(weekRange.end))
                                    .map(evt => ({...evt, days: GetDayArrayFromRRule(evt, tz) }) )
    
    var arr = [];
    const promises = events.map(evt =>
        new Promise((resolve,reject)=>{
            const newArrays = evt.days.map( day => {
                var a = {...evt, startMoment : day.start.tz(tz) , start : day.start.toISOString(), end : day.end.toISOString()  };
                delete a.days;
                return a;
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










export const getCurrentEventIndex = (events)=>{
    const now = moment();
    const closest = events.reduce((a, b) =>
        Math.abs(b.startMoment.diff(now)) < Math.abs(a.startMoment.diff(now)) ? b : a
      );
    return events.indexOf(closest)
      
}