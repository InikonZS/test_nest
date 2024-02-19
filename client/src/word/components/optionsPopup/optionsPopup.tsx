import React, { useEffect, useState } from 'react';
import './optionsPopup.css';
import { IGameOptions } from '../../core/interfaces';

interface IOptionsPopupProps{
    initialOptions: IGameOptions;
    onSubmit: (options: IGameOptions)=>void;
    onClose: ()=>void;
}

const modes = {
    'single': 1,
    'vs bot': 2
}

const counts = {
    '50': 50,
    '100': 100,
    '200': 200,
    '300': 300,
    '500': 500
}

export function OptionsPopup({initialOptions, onSubmit, onClose}: IOptionsPopupProps){
    const [options, setOptions] = useState<IGameOptions>(initialOptions);
    useEffect(()=>{
        setOptions(initialOptions);
    }, [initialOptions]);

    return (
        <div className='optionsPopup_popup'>
            <div className='optionsPopup_header'>OPTIONS</div>
            <div className='optionsPopup_group_header'>Game mode:  </div>
            <div className='optionsPopup_select optionsPopup_mode_select'>
                {Object.keys(modes).map((it: keyof typeof modes)=>{
                    return <button className={`select_button ${options.players == modes[it] ? 'select_button_active':''}`} onClick={()=>{
                        setOptions(last=>{
                            return {...last, players: modes[it]}
                        })
                    }}>{it}</button>
                })}
            </div>
            <div className='optionsPopup_group_header'>Letters count: </div>
            <div className='optionsPopup_select optionsPopup_letters_select'>
                {Object.keys(counts).map((it: keyof typeof counts)=>{
                    return <button className={`select_button ${options.letters == counts[it] ? 'select_button_active':''}`} onClick={()=>{
                        setOptions(last=>{
                            return {...last, letters: counts[it]}
                        })
                    }}>{it}</button>
                })}
            </div>
            <div className={'optionsPopup_buttons_group'}>
                <button className={'default_button'} onClick={()=>{
                    onSubmit(options);
                }}>apply</button>
                <button className={'default_button'} onClick={()=>{
                    onClose();
                }}>cancel</button>
            </div>
        </div>
    )
}