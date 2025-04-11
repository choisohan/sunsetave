import React from 'react'
import PopupWindow from './PopupWindow'
import HouseBuilder from './HouseBuilder'

export default function Info(props) {
  return (
    <PopupWindow isOpened={true} setIsOpened={()=>{props.onClose()}} >
        <div className=''>
            <h2>Builder</h2>
            <HouseBuilder />

        </div>
    </PopupWindow>
  )
}
