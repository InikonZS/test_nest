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
            <div className='letterList_popup_back'>
            <div className='letterList_header'>LETTERS</div>
            <div className='letterList_wrapper'>
                {Object.keys(letters).map(letter=>{
                    return <div className='letterList_item'>
                        <div className={`cell letterList_cell ${letters[letter] ? '' : 'letterList_cell_empty'}`}>
                            {letter}
                        </div>
                        <div className='letterList_count'>{letters[letter]}</div>
                    </div>
                })}
            </div>
            </div>
        </div>
    )
}