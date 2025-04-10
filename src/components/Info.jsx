import React from 'react'
import PopupWindow from './PopupWindow'
import HouseBuilder from './HouseBuilder'

export default function Info(props) {
  return (
    <PopupWindow isOpened={true} setIsOpened={()=>{props.onClose()}} >
        <div style={{padding: '20px', minWidth:'500px', minHeight: '400px' , maxHeight: '90vh', placeItems:'center'}} >
            <h2>Builder</h2>
            <HouseBuilder />

        </div>
    </PopupWindow>
  )
}
