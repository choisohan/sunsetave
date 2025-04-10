import ICAL from "ical.js";
import { SampleCalendars } from "./SampleCalendars";
import {SortCalendarData} from  './SortEvents'



//http://localhost:3000/8c063daee6e0ebb0eac75293727a2b85d9024b26c96fd2ad4f9a7489bbf835a1

export const fetchCalendar = async (icalUrl) => {

    console.log( 'fetch ')
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
        console.log( data )
        const jcalData = ICAL.parse(data.icalData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");

        const parsedEvents = vevents.map(event => {

            const vevent = new ICAL.Event(event);
            const rruleProp = event.getFirstPropertyValue("rrule");
            const rrule = rruleProp ? new ICAL.Recur(rruleProp) : null;

            return {
                summary: vevent.summary,
                description: vevent.description,
                start: vevent.startDate.toString(),
                end: vevent.endDate.toString(),
                rrule: rrule ? rrule.toString() : null 
            };
        });

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
      cal = await SampleCalendars[_id]
    }else{
      cal =  await fetchCalendar(_id)
      console.log( 'fetched ',cal )
    }
    return await SortCalendarData(cal);
  }
  
  
  