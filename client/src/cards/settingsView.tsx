import React from "react";
import './settingsView.css';

interface ISettingsViewProps{
    onCountChange: (count: number)=>void;
    playersCount: number;
}

export function SettingsView({onCountChange, playersCount}: ISettingsViewProps){

    return <div className="settings_wrapper">
        <button className="settings_close_button" onClick={()=>{
            onCountChange(playersCount);
        }}>x</button>
        <div className="count_header">Players count: </div>
        <div className="settings_count">
            {[2, 3, 4, 5].map(count=>{
                return <button className={`count_button ${count == playersCount ? 'count_button_selected' : ''}`} onClick={()=>{
                    onCountChange(count);
                }}>{count}</button>
            })}
        </div>
    </div>
}