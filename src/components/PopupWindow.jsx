import React from 'react'

export default function PopupWindow(props) {

  const onClickOutside = (e)=>{
    if(e.target.className.includes('fixed') ){
      props.setIsOpened(false)
    }
  }

  if(!props.children) return;

  return (
    <div className='z-[5] w-full h-full bg-black fixed top-0 left-0 bg-opacity-50 place-content-center place-items-center' onClick={onClickOutside}>
        <div className='relative flex flex-col bg-white border-solid border-4 border-black lg:max-w-[650px] lg:max-h-[500px]  lg:p-4 h-screen w-screen'>
          <button className='absolute top-0 right-0' onClick={()=>{props.setIsOpened(false)}}>Close</button>
          {props.children}
      </div>
    </div>
  )
}
