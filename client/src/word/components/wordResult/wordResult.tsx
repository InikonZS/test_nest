import React from 'react';
import './wordResult.css';
import { FieldLetter } from '../../core/fieldLetter';

interface IWordResultProps{
    scoreData: {
        mainWord: FieldLetter[];
        sideWords: FieldLetter[][];
        score: number;
    };
}

export function WordResult({scoreData}: IWordResultProps){
    const words = [scoreData.mainWord, ...scoreData.sideWords];
    return (
        <div className='wordResult_popup'>
            {words.map(word=>{
                return <div className='row wordResult_word'>
                    {word.map(letter=>{
                        return <div className='cell cell_input'>{letter.text}</div>;
                    })}
                </div>
            })}
        </div>
    )
}