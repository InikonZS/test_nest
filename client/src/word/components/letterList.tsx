import React from 'react';
import './letterList.css';

interface ILetterListProps{
    letters: Record<string, number>;
    onClose: ()=>void;
}

export function LetterList({letters, onClose}: ILetterListProps){
    return (
        <div className='letterList_popup'>
            <button className='letterList_closeButton' onClick={onClose}>x</button>
            <div className='letterList_wrapper'>
                {Object.keys(letters).map(letter=>{
                    return <div className={`cell letterList_cell ${letters[letter] ? '' : 'letterList_cell_empty'}`}>
                        <div>{letter}</div>
                        <div>{letters[letter]}</div>
                    </div>
                })}
            </div>
        </div>
    )
}