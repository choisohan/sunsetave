import React,{useContext,useState, useEffect} from "react";

const TimestampContext = React.createContext();
const UpdateTimestampContext = React.createContext();
const TimezoneOverride = React.createContext();
const SetTimezoneOVerride = React.createContext();
const TimePlayModeContext = React.createContext();
const SetTimePlayModeContext = React.createContext();



const audio = document.createElement('audio');
document.body.appendChild(audio)
audio.src = '/audios/cars-on-the-road.mp3'
audio.loop = true; 
audio.id = 'bgAudio';
audio.volume = .2; 


export function EnvProvider({children}){
    const [ timestamp,setTimeStamp] = useState( new Date().valueOf()  );
    const [ playmode , setPlayMode] = useState('normal'); //fast
    const [ timezoneOverride, setTimezoneOverride] = useState();

    useEffect(() => {
        const handleClick = (e) => {
            audio.play();
            window.removeEventListener('click', handleClick, true);
        };
        window.addEventListener('click', handleClick, true);

        return () => window.removeEventListener('click', handleClick, true);
    }, []);

    useEffect(()=>{
        if(playmode === 'forward'|| playmode === 'backward') setPlayMode('normal')
    },[playmode])

      
    return (
        <SetTimePlayModeContext.Provider value={setPlayMode}>
            <TimePlayModeContext.Provider value={playmode}>
                <UpdateTimestampContext.Provider value={setTimeStamp}>
                    <TimestampContext.Provider value={timestamp}>
                        <TimezoneOverride.Provider value={timezoneOverride}>
                            <SetTimezoneOVerride.Provider value={setTimezoneOverride}>
                                {children}
                            </SetTimezoneOVerride.Provider>
                        </TimezoneOverride.Provider>
                    </TimestampContext.Provider>                
                </UpdateTimestampContext.Provider>
        </TimePlayModeContext.Provider>                
    </SetTimePlayModeContext.Provider>
    )
}

export function useTimestamp(){
    return useContext(TimestampContext)
}
export function useUpdateTimestamp(){
    return useContext(UpdateTimestampContext)
}
export function useTimezoneOverride(){
    return useContext(TimezoneOverride)
}
export function useSetTimezoneOverride(){
    return useContext(SetTimezoneOVerride)
}

export function useTimePlayMode(){
    return useContext(TimePlayModeContext)
}
export function useUpdateTimePlayMode(){
    return useContext(SetTimePlayModeContext)
}