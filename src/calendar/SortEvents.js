import { RRule } from "rrule";
import moment from "moment-timezone";


// Mapping string to RRule constant
const freqMap = {
    "YEARLY": RRule.YEARLY,
    "MONTHLY": RRule.MONTHLY,
    "WEEKLY": RRule.WEEKLY,
    "DAILY": RRule.DAILY,
    "HOURLY": RRule.HOURLY,
    "MINUTELY": RRule.MINUTELY,
    "SECONDLY": RRule.SECONDLY
};


const WeekRange = ( tz , offset )=>{
    const nowMoment = moment().tz(tz || Intl.DateTimeFormat().resolvedOptions().timeZone);
    const lastMondayStart = nowMoment.clone().startOf('week').add(offset, 'week').add(1, 'day');
    const nextSundayEnd = lastMondayStart.clone().endOf('week').add(1, 'day');
    return {start: lastMondayStart, end: nextSundayEnd}
}


export const GetDayArrayFromRRule = (event, _timezone)=>{
    const rule = new RRule({ // Convert JSON to RRule
        freq: freqMap[event.rrule.freq], 
        interval: event.rrule.interval,
        until: new Date(event.rrule.until) 
    });

    return rule.all().map( d=> {
        const minutes = moment(event.end).diff(moment(event.start),'minutes');
        var dm = moment(d).tz(_timezone) 
        return {start : dm , end : dm.clone().add( minutes, 'minutes')  }
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