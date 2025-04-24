import React from 'react'
import { useUpdatePopup } from '../contexts/PopupContext';

export default function PopupWindow(props) {

  const setPopup = useUpdatePopup();

  const onClickOutside = (e)=>{
    if(e.target.className.includes('fixed') ) setPopup()
    
  }

  if(!props.children) return;

  return (
    <div className='popup z-[5] w-full h-full bg-black fixed top-0 left-0 bg-opacity-50 place-content-center place-items-center' onClick={onClickOutside}>
        <div className='relative flex flex-col bg-white border-solid border-4 border-black lg:max-w-[650px] lg:max-h-[600px]  lg:p-4 h-screen w-screen overflow-scroll'>
          <button className='absolute top-0 right-0' onClick={()=>{setPopup()}}>Close</button>
          {props.children}
      </div>
    </div>
  )
}
