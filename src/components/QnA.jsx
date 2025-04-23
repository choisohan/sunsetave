import React from 'react'

export default function QnA() {
  return (
    <div className='max-w-[800px]'>
        <h1>QnA</h1>
        <Question>1. What is Sunset Ave?</Question>
        <Answer>
        Sunset Ave is an open-source project developed by a single individual.<br />
        It was originally created to address the inconvenience of checking the time before contacting family and friends in different time zones. <br />
        The proposed solution was a visual representation of time differences.<br />
        The project has undergone multiple iterations, resulting in its current form.<br />

        </Answer>

        <Question>2. Is it free to make my own?</Question>
        <Answer>Yes. All you need is a public Google Calendar iCal ID.<br />
        Once created, you can add events to represent your daily routine.<br />
        You can set events for specific days or create recurring events like "Lunch," "Work," or "Sleep."<br />
        Including certain emojis will influence the appearance of your house render. For more details, click on the number 7.<br />
        Please remember not to include sensitive information that could put your privacy at risk.
        </Answer>

        <Question>3. Why does a calendar need to be public? </Question>
        <Answer>The calendar needs to be public because the data cannot be fetched from a private calendar.</Answer>

        <Question>4. Can I add my friend or family's house to my page?</Question>
        <Answer>Yes. Simply click the + button, enter the URL, and place their house.</Answer>

        <Question>5. Can I use other calendar than google calendar?</Question>
        <Answer>Currently, only Google Calendar is supported. If this feature becomes available in the future, please contact the developer.</Answer>

        <Question>6. Where do you store my data?</Question>
        <Answer> Sunset Avenue does not store any user data. All house/calendar data is sourced from the calendar provided by the user.<br />
            The rest of the data is stored locally in the user's web browser.</Answer>

        <Question>7. How to create effect on event by using emoji ?</Question>
        <Answer>Sorry. The information is coming soon....</Answer>

        <Question>8. [Advanced] Customizing house Info with calendar description</Question>
        <Answer>Sorry. The information is coming soon....</Answer>

        <Question>9. How can I contact the developer?</Question>
        <Answer> email me. mjwithu09@gmail.com </Answer>
    </div>
  )
}



const Question = ({children})=>{

    const onClick= (e)=>{
        const answerDiv = e.target.nextElementSibling;

        const isOpened = answerDiv.style.display !== 'none';
        answerDiv.style.display = !isOpened? 'block': 'none'

        e.target.style.backgroundColor =  !isOpened? 'black': ''
        e.target.style.color =  !isOpened? 'white': ''

    }
    
    return <div className='question text-lg	 cursor-pointer bg-gray-200 hover:bg-gray-300 p-1' onClick={onClick}>{children}</div>
}


const Answer = ({children})=>{
    return <div className='answer bg-gray-100 p-1 mb-20 out border-[5px] border-black' style={{display:'none'}} >{children}</div>
}