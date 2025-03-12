export const SampleCalendar = {
    "name": "SampleCalendar",
    "description": "This is SampleCalendar Description!",
    "timezone": "America/Vancouver",
    events: [
        {
            "summary": "Walk Outside",
            "description": "I will walk outside!",
            "start": "2025-03-06T10:00:00",
            "end": "2025-03-06T10:30:00",
            "rrule": {
                "freq": "DAILY",
                "interval": 2,
                "until": "2025-04-12T06:59:59Z"
            }
        }
    ]
}