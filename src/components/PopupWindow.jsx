import React, { useEffect } from 'react'

export default function PopupWindow(props) {

  const onClickOutside = (e)=>{
    if(e.target.className.includes('fixed') ){
      props.setIsOpened(false)
    }
  }

  if(!props.children) return;

  return (
    <div className='z-[5] w-full h-full bg-black fixed top-0 left-0 bg-opacity-50 place-content-center place-items-center' onClick={onClickOutside}>
        <div className='relative flex flex-col bg-white border-solid border-4 border-black min-w-[550px] min-h-[400px] p-4'>
          <button className='absolute top-0 right-0' onClick={()=>{props.setIsOpened(false)}}>Close</button>
          {props.children}
      </div>
    </div>
  )
}
