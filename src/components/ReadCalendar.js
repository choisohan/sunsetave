import ICAL from "ical.js";



export const fetchCalendar = async () => {
    const icalUrl = "/calendar/ical/8c063daee6e0ebb0eac75293727a2b85d9024b26c96fd2ad4f9a7489bbf835a1%40group.calendar.google.com/public/basic.ics"; // Replace with your iCal URL

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

    } catch (error) {
        console.error("Error fetching iCalendar:", error);
    }
};