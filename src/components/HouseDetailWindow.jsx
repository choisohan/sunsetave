import React, { useEffect } from 'react'

export default function HouseDetailWindow(props) {


  const onClickDiv = (e)=>{
    if(e.target.className === 'fullscreen'){
      props.onClose()
    }
  }


  if(props.property) {
    return (
      <div className='fullscreen' onClick={onClickDiv} >
        <div className='houseDetail' style={{zIndex:1000}}>
          <h3>{props.property.name}</h3>
          <button onClick={()=>{props.onClose()}}>Close</button>
        </div>
      </div>

    )
  }

}
