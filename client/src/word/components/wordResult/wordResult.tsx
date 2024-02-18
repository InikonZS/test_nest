import React, { useEffect, useState } from 'react';
import './wordResult.css';
import { FieldLetter } from '../../core/fieldLetter';
import { Boosters, IBoostedWord } from '../../core/game';

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
    console.log(scoreData);
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
            <div className='wordResult_score'>
                {scoreData.score}
            </div>
            <div key={JSON.stringify(scoreData)}>
                {words.map((boostedWord, wordIndex)=>{
                    return <div className='row wordResult_word'>
                        {boostedWord.word.map((boostedLetter, letterIndex)=>{
                            renderedLetterCount +=1;
                            const cellClass = `cell cell_input ${animationStage=='show' ? 'cell_show': 'cell_shown'} ${(animationStage=='wordBoost' && boostedWord.wordBoosters[0]) ? (boostedWord.wordBoosters[0] == Boosters.doubleWord ? 'cell_boost_2w' : 'cell_boost_3w'): ''} ${(animationStage=='letterBoost' && boostedWord.wordBoosters[0]) ? (boostedWord.wordBoosters[0] == Boosters.doubleWord ? 'cell_boosted_2w' : 'cell_boosted_3w'): ''} ${(animationStage=='letterBoost' && boostedLetter.booster) ? (boostedLetter.booster == Boosters.doubleLetter ? 'cell_boost_2l' : 'cell_boost_3l'): ''} `;
                            return <div className={cellClass} style={{'--delay': `${(renderedLetterCount - 1)*delayLetters}ms`}}>{boostedLetter.letter.text}</div>;
                        })}
                    </div>
                })}
            </div>
        </div>
    )
}