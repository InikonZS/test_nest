import React from 'react';
import './smallCard.css';

interface ISmallCardProps{
    title?: string,
    technologies?: string[],
    imgs?: string[],
    gameUrl?: string,
    sourceUrl?: string,
    gameText?: React.ReactNode,
    GameComponent?: React.FunctionComponent,
}

export function SmallCard(data: ISmallCardProps){
    return <div className='smallCard'>
        <div>
            <div className='smallCard_title'>
                {data.title || ""}
            </div>
            <div className='smallCard_text'>
                {data.gameText || ""}
            </div>
            <div className='smallCard_preview'>
                {data.imgs && data.imgs.map(it=>{
                    return <div className='smallCard_preview_item'>
                        <img src={it}></img>
                    </div>
                })}
            </div>
        </div>
        <div className='smallCard_links'>
            {data.gameUrl && <a href={data.gameUrl} target='_blank' className='proCard_link smallCard_button'>Demo</a>}
            {data.sourceUrl && <a href={data.sourceUrl} target='_blank' className='proCard_link smallCard_button'>Source</a>}
        </div>
    </div>
}