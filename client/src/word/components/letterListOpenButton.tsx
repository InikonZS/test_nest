import React from 'react';
import './letterListOpenButton.css';

interface ILetterListOpenButtonProps{
    count: number;
    onClick: ()=>void;
}

export function LetterListOpenButton({count, onClick}: ILetterListOpenButtonProps){
    return (
        <div className='letterListOpenButton_wrapper'>
            <button className='letterListOpenButton_button' onClick={onClick}><div>Letters</div><div className='letterListOpenButton_count'>{count}</div></button>
        </div>
    )
}