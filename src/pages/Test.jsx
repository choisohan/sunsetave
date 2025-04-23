import HouseViewer from "./HouseViewer";


export default function Test() {


  return <div className="h-screen w-screen bg-yellow-200">

<div className="h-[600px] w-[400px] flex">
<HouseViewer className='w-[300px] h-[600px] ' id='sample&&paris'/>
<HouseViewer className='w-[300px] h-[600px] ' id='sample&&ny'/>
<HouseViewer className='w-[300px] h-[600px] ' id='sample&&hoian'/>
<HouseViewer className='w-[300px] h-[600px] ' id='sample&&tokyo'/>
</div>
  </div>

}
