import React, { useState } from 'react'
import PopupWindow from './PopupWindow'
import HouseBuilder from './HouseBuilder';


export default function AddNewHouseForm(props) {
    const [icalURL, setIcalURL] = useState("");
    const [property, setProperty] = useState(null);

  return (
    <PopupWindow isOpened={true} setIsOpened={()=>{props.onClose()}} >
        <h3>Add a new house to my avenue</h3>
      <input
        type="text"
        value={icalURL}
        onChange={setIcalURL}
        className="w-full border-2 border-gray-300 p-2 rounded-lg"
        placeholder="https://calendar.google.com/calendar/ical/......ics"
        required
      />

      Found it!

{/* When Calendar is user's

      <HouseBuilder />

      <textarea value={"ER2EdwXOEaRE24WLCVBLerD1FERE1"}/>
      4. Copy this code to the calendar description. <br />




*/}


<button onClick={()=>{props.onAddNew()}} >Add to My Sunset Avenue</button>



    </PopupWindow>
  )
}
