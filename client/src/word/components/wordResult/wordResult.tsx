import React, { useEffect, useState } from 'react';
import './wordResult.css';
import { FieldLetter } from '../../core/fieldLetter';
import { IBoostedWord } from '../../core/game';

interface IWordResultProps{
    scoreData: {
        words: IBoostedWord[]
        score: number;
    };
    onAnimated: ()=>void;
}

export function WordResult({scoreData, onAnimated}: IWordResultProps){
    const words = scoreData.words;
    const [animationStage, setAnimationStage] = useState('show');
    const delayLetters = 200;
    useEffect(()=>{
        setAnimationStage('show');
        let aBID: ReturnType<typeof setInterval> = null;
        const wordBoostDelay = 300 + scoreData.words.reduce((ac, word)=> ac + word.word.length * delayLetters, 0);
        const isWordBoosters = !!scoreData.words.find(word=>word.wordBoosters.length);
        const wBID = setTimeout(()=>{
            setAnimationStage('wordBoost');
        }, wordBoostDelay);
        const lBID = setTimeout(()=>{
            setAnimationStage('letterBoost');
            aBID = setTimeout(()=>{onAnimated()}, 900);
        }, isWordBoosters ? wordBoostDelay + 600 : wordBoostDelay);
        return ()=>{
            clearInterval(aBID);
            clearInterval(wBID);
            clearInterval(lBID);
        }
    }, [scoreData]);

    let renderedLetterCount = 0;
    return (
        <div className='wordResult_popup'>
            <div key={JSON.stringify(scoreData)}>
                {words.map((boostedWord, wordIndex)=>{
                    return <div className='row wordResult_word'>
                        {boostedWord.word.map((boostedLetter, letterIndex)=>{
                            renderedLetterCount +=1;
                            const cellClass = `cell cell_input ${animationStage=='show' ? 'cell_show': 'cell_shown'} ${(animationStage=='wordBoost' && boostedWord.wordBoosters[0]) ? 'cell_boost_2w': ''} ${(animationStage=='letterBoost' && boostedWord.wordBoosters[0]) ? 'cell_boosted_2w': ''} ${(animationStage=='letterBoost' && boostedLetter.booster) ? 'cell_boost_2l': ''} `;
                            return <div className={cellClass} style={{'--delay': `${(renderedLetterCount - 1)*delayLetters}ms`}}>{boostedLetter.letter.text}</div>;
                        })}
                    </div>
                })}
            </div>
            <div>
                {scoreData.score}
            </div>
        </div>
    )
}