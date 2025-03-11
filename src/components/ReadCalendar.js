import ICAL from "ical.js";



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
      console.log('iCal data:', data.icalData);
    })
    .catch(error => {
      console.error('Error fetching iCal data:', error);
    });

};