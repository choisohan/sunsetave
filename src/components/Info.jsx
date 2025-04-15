import React from 'react'
import PopupWindow from './PopupWindow'
import HouseBuilder from './HouseBuilder'

export default function Info(props) {
  return (
    <PopupWindow>
        <div className='self-center'>
            <h2>Builder</h2>
            <HouseBuilder />
        </div>
    </PopupWindow>
  )
}
