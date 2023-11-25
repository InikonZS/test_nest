import React, { useRef } from "react";

export function SideMenu({onMenu, onClose}:{onMenu: ()=>void, onClose: ()=>void}) {
    const shadowRef = useRef<HTMLDivElement>();
    return (
        <div ref={shadowRef} className="base_popup_shadow" onClick={(e)=>{
            if (e.target === shadowRef.current){
                onClose();
            }
        }}>
            <div className="base_popup_window">
                <button onClick={()=>{
                    onMenu();
                }}>menu</button>
            </div>
        </div>
    )
};