import React,{useContext,useEffect,useState} from "react";

const PopupContext = React.createContext();
const UpdatePopupContext = React.createContext();



export function PopupProvider({children}){
    const [ Popup,setPopup] = useState();

    return (
            <UpdatePopupContext.Provider value={setPopup}>
                <PopupContext.Provider value={Popup}>
                    {children}
                </PopupContext.Provider>                
            </UpdatePopupContext.Provider>
    )
}

export function usePopup(){
    return useContext(PopupContext)
}
export function useUpdatePopup(){
    return useContext(UpdatePopupContext)
}
