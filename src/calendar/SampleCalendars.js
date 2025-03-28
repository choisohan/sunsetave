export const SampleCalendars ={
    "SampleCalendar" : {
        name: "SampleCalendar",
        description: "This is SampleCalendar Description!",
        timezone: "America/Vancouver",
        events: [
            {
                summary: "Walk Outside",
                description: "I will walk outside!",
                start: "2024-03-06T10:00:00",
                rrule: {
                    freq: "DAILY",
                    interval: 1,
                }
            },
            {
                summary: "Sleep",
                description: "sleep!",
                start: "2024-03-06T20:00:00",
                rrule: {
                    freq: "DAILY",
                    interval: 1,

                }
            }
        ]
    },
    "Mozart": {
        name:"Mozart",
        timezone:"Europe/Vienna",
        description:"Mozart's House",
        events: [
            {
                summary: "Breakfast",
                start: "2025-03-06T06:00:00",
                end: "2025-03-06T07:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Compose Music",
                start: "2025-03-06T07:00:00",
                end: "2025-03-06T09:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Music Lesson",
                start: "2025-03-06T09:00:00",
                end: "2025-03-06T13:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Lunch and Socializing",
                start: "2025-03-06T13:00:00",
                end: "2025-03-06T15:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Compose Music",
                start: "2025-03-06T15:00:00",
                end: "2025-03-06T19:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Socializing",
                start: "2025-03-06T19:00:00",
                end: "2025-03-06T21:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Extra Composing Before bed",
                start: "2025-03-06T21:00:00",
                end: "2025-03-07T00:00:00",
                rrule: { freq: "DAILY" }
            }
        ]
        
    },
    "Darwin":{
        name:"Darwin",
        timezone:"Europe/London",
        description:"Darwin's House",
        events: [
            {
                summary: "Short Walk after waking up",
                start: "2025-03-06T07:00:00",
                end: "2025-03-06T08:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Morning Work(Writing and Research)",
                start: "2025-03-06T08:00:00",
                end: "2025-03-06T10:30:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Long Walk and Thinking",
                start: "2025-03-06T10:30:00",
                end: "2025-03-06T12:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Lunch(And Reading mails)",
                start: "2025-03-06T12:00:00",
                end: "2025-03-06T15:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Afternoon Work",
                start: "2025-03-06T15:00:00",
                end: "2025-03-06T16:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Tea and Book",
                start: "2025-03-06T16:00:00",
                end: "2025-03-06T17:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Social or Relax",
                start: "2025-03-06T17:00:00",
                end: "2025-03-06T19:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Dinner and Leisure",
                start: "2025-03-06T19:00:00",
                end: "2025-03-06T22:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Sleep",
                start: "2025-03-06T22:00:00",
                rrule: { freq: "DAILY" }
            }
    ]},
    "Freud": {
        name:"Freud",
        timezone:"Europe/Vienna",
        description:"Freud's House",
        events:[
            {
                summary: "Breakfast and Cigar",
                start: "2025-03-06T07:00:00",
                end: "2025-03-06T08:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "See Patients",
                start: "2025-03-06T08:00:00",
                end: "2025-03-06T12:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Lunch with family",
                start: "2025-03-06T12:00:00",
                end: "2025-03-06T13:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Writing and Research",
                start: "2025-03-06T13:00:00",
                end: "2025-03-06T15:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "See patient",
                start: "2025-03-06T15:00:00",
                end: "2025-03-06T21:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Reading and Socializing",
                start: "2025-03-06T21:00:00",
                end: "2025-03-06T23:00:00",
                rrule: { freq: "DAILY" }
            }
        ]},
    "VanGogh":{
        name:"Van Gogh",
        timezone: "Europe/Paris",
        description: "Painter",
        events: [
            {
                summary: "Breakfast",
                start: "2025-03-06T06:00:00",
                end: "2025-03-06T19:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Outdoor Painting",
                start: "2025-03-06T07:00:00",
                end: "2025-03-06T14:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Lunch and Rest",
                start: "2025-03-06T14:00:00",
                end: "2025-03-06T16:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Painting",
                start: "2025-03-06T16:00:00",
                end: "2025-03-06T19:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Writing Letter or Reading, Meeting up other artists",
                start: "2025-03-06T07:00:00",
                end: "2025-03-06T21:00:00",
                rrule: { freq: "DAILY" }
            }
        ]
        },
    'BruceLee':{
        name:'Bruce Lee',
        timezone:"Asia/Hong_Kong",
        description:"Bruce's House",
        events:[
            {
                summary: "Morning Meditation",
                start: "2025-03-06T06:30:00",
                end: "2025-03-06T07:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Strength training and stretching",
                start: "2025-03-06T07:00:00",
                end: "2025-03-06T08:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Breakfast",
                start: "2025-03-06T08:00:00",
                end: "2025-03-06T09:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Martial arts practice",
                start: "2025-03-06T09:00:00",
                end: "2025-03-06T12:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Lunch",
                start: "2025-03-06T12:00:00",
                end: "2025-03-06T13:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Read about philosophy",
                start: "2025-03-06T13:00:00",
                end: "2025-03-06T15:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Evening Martial arts training",
                start: "2025-03-06T15:00:00",
                end: "2025-03-06T18:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Family time",
                start: "2025-03-06T18:00:00",
                end: "2025-03-06T20:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Light Dinner and Reflect",
                start: "2025-03-06T20:00:00",
                end: "2025-03-06T22:00:00",
                rrule: { freq: "DAILY" }
            }
        ]},
    "Einstein":{
        name:"Einstein",
        timezone: "America/New_York",
        events:[
            {
                summary: "Simple Breakfast",
                start: "2025-03-06T07:00:00",
                end: "2025-03-06T08:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Study",
                start: "2025-03-06T08:00:00",
                end: "2025-03-06T12:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Lunch",
                start: "2025-03-06T12:00:00",
                end: "2025-03-06T13:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Work alone or talk with colleagues, lectures",
                start: "2025-03-06T13:00:00",
                end: "2025-03-06T16:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Walk or Listening Musics",
                start: "2025-03-06T16:00:00",
                end: "2025-03-06T17:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Writing Letters",
                start: "2025-03-06T17:00:00",
                end: "2025-03-07T07:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Dinner",
                start: "2025-03-06T19:00:00",
                end: "2025-03-06T21:00:00",
                rrule: { freq: "DAILY" }
            },
            {
                summary: "Reading",
                start: "2025-03-06T21:00:00",
                end: "2025-03-06T22:00:00",
                rrule: { freq: "DAILY" }
            }
        ]}
    }