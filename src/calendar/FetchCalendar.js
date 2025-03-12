import ICAL from "ical.js";


//http://localhost:3000/?url=8c063daee6e0ebb0eac75293727a2b85d9024b26c96fd2ad4f9a7489bbf835a1
export const fetchCalendar = async (icalUrl) => {
    const serverURL = 'https://unruly-calm-sorrel.glitch.me'
    fetch(serverURL+'/fetch-ical',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  
        },
        body:JSON.stringify({
            url: `https://calendar.google.com/calendar/ical/${icalUrl}%40group.calendar.google.com/public/basic.ics`
        })
    })  
    .then(response => response.json())  
    .then(data => {

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

        const calendarData =  {
            name: comp.getFirstPropertyValue("x-wr-calname") ,
            description: comp.getFirstPropertyValue("x-wr-caldesc") ,
            timezone: comp.getFirstPropertyValue("x-wr-timezone") ,
            events:parsedEvents
        }
        console.log(calendarData )

        
    })
    .catch(error => {
      console.error('Error fetching iCal data:', error);
    });

};