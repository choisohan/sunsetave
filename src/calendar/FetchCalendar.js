import ICAL from "ical.js";
import {SortCalendarData} from  './SortEvents'

const SampleCalendars ={};
["paris","tokyo", "ny","hoian",'fes','van','nz','bs',"gk"].forEach( city =>
  fetch(`/calendars/${city}.json`)
  .then(res => res.json())
  .then( data=>{
    SampleCalendars[city] = data; 
  })
)


export const fetchCalendar = async (icalUrl) => {

    const serverURL = 'https://unruly-calm-sorrel.glitch.me'

    return fetch(serverURL+'/fetch-ical',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  
        },
        body:JSON.stringify({
            url: `https://calendar.google.com/calendar/ical/${icalUrl}%40group.calendar.google.com/public/basic.ics`
        })
    })  
    .then(response => response.json())  
    .then(async data => {
        const jcalData = ICAL.parse(data.icalData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");

        const parsedEvents = vevents.map(event => {

            const vevent = new ICAL.Event(event);
            const rruleProp = event.getFirstPropertyValue("rrule");
            const rrule = rruleProp ? new ICAL.Recur(rruleProp) : null;
            if( !rrule ) return; // filter whole day event
            return {
                summary: vevent.summary,
                description: vevent.description,
                start: vevent.startDate.toString(),
                end: vevent.endDate.toString(),
                rrule: rrule ? rrule.toString() : null 
            };
        }).filter ( x=> x )

        return Promise.resolve(parsedEvents).then(eventArray=>
        {
            const calendarData =  {
                name: comp.getFirstPropertyValue("x-wr-calname") ,
                description: comp.getFirstPropertyValue("x-wr-caldesc") ,
                timezone: comp.getFirstPropertyValue("x-wr-timezone") ,
                events: eventArray
            }
            return calendarData
        })
        
    })
    .catch(error => {
      console.error('🔴Error fetching iCal data:', error);
    });

};

export const FindCalendar = async(_id)=>{
    var cal; 
    if(_id.includes('sample&&')){
      _id = _id.split('sample&&')[1];
      cal = await SampleCalendars[_id];
    }else{
      cal =  await fetchCalendar(_id)
    }
    return await SortCalendarData(cal);
  }
  
  
  