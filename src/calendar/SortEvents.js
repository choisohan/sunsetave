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
    const recentOccurrences = rule.between( DateFromNow(-10), DateFromNow(+10) , true); // todo: this matters. 

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
                const _evt = {...evt, startMoment : day.start.tz(tz) , endMoment: day.end.tz(tz) };
                delete _evt.days;
                return _evt;
            })
            arr = [...arr,...newArrays]
            resolve(true) ;
        }
    ))

    
    var foundJson = ExtractJsonFromString(_calendar.description)

    return {..._calendar,...foundJson, events: await Promise.all(promises).then( () =>{
        arr = arr.sort((a, b) =>  a.startMoment.diff(b.startMoment));
        return(arr);
    })}
}


const ExtractJsonFromString = (string)=>{
    const match = string.match(/{.*}/s); // /s lets dot match newlines

    if (!match) return; 
    var jsonStr = match[0];
    var jsonObject = parseShorthandObject(jsonStr);
    return jsonObject; 
    

}


const parseShorthandObject = (str) => {
    const trimmed = str.trim().replace(/^{|}$/g, ""); // remove { and }
    const entries = trimmed.split(",").map(pair => {
      const [key, value] = pair.split(":");
      return [key.trim(), value.trim()];
    });
  
    return Object.fromEntries(entries);
  };








export const getCurrentEventIndex = ( events, _timestamp )=>{
    
    const future = events.filter( evt =>
    evt.endMoment.isAfter( new moment(_timestamp) )
    )

   return Math.max(0, Math.min(  events.length -1 , events.length - future.length ))
      
}

