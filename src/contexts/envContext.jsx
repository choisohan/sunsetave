import React,{useContext,useState, useEffect} from "react";

const TimestampContext = React.createContext();
const UpdateTimestampContext = React.createContext();
const TimezoneOverride = React.createContext();
const SetTimezoneOVerride = React.createContext();
const TimePlayModeContext = React.createContext();
const SetTimePlayModeContext = React.createContext();

const addSound = (path, volume) => {
    const audio = document.createElement('audio');
    document.body.appendChild(audio)
    audio.src = path
    audio.loop = true; 
    audio.classList.add('bgAudio');
    audio.volume = volume; 
    return   audio;  
}


const audios = [];
audios.push(addSound('/audios/cars-on-the-road.mp3', .1))
audios.push(addSound('/audios/seagulls-distant.mp3', 1.))




export function EnvProvider({children}){
    const [ timestamp,setTimeStamp] = useState( new Date().valueOf()  );
    const [ playmode , setPlayMode] = useState('normal'); //fast
    const [ timezoneOverride, setTimezoneOverride] = useState();

    useEffect(() => {
        const handleClick = (e) => {
            audios.forEach( a=> a.play() )
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