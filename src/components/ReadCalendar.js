import ICAL from "ical.js";



export const fetchCalendar = async (icalUrl) => {

    try {
        const response = await fetch(icalUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

       const text = await response.text();
       const jcalData = ICAL.parse(text);
       const comp = new ICAL.Component(jcalData);
       const vevents = comp.getAllSubcomponents("vevent");

       const parsedEvents = vevents.map(event => {
           const vevent = new ICAL.Event(event);
           return {
               summary: vevent.summary,
               start: vevent.startDate.toString(),
               end: vevent.endDate.toString(),
           };
       });
       return text

    } catch (error) {
        console.error("Error fetching iCalendar:", error);
    }
};