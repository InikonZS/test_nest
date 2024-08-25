import React, { useEffect, useState } from "react";
import './proCard.css';

interface IProCardProps{
    title: string,
    technologies: string[],
    imgs: string[],
    gameUrl: string,
    gameText: string
}

const gameExample: IProCardProps = {
    title: 'Project Title',
    technologies: ['React', 'Pixi'],
    imgs: ['https://inikonzs.github.io/no_build_demos/index_assets/bricks_screen1.png'],
    gameUrl: 'https://aquamarine-cucurucho-8f39a2.netlify.app/',
    gameText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cum, eveniet facere magnam ullam iusto esse, voluptatem pariatur illum soluta, fugit eligendi excepturi molestias ab temporibus doloribus officia at exercitationem?'
}

export function ProCard({title, technologies, imgs, gameUrl, gameText}: IProCardProps){
    const [isUnwrapped, setUnwrapped] = useState(false);
    const [isRunned, setRunned] = useState(false);

    useEffect(()=>{
        if (isUnwrapped){
            window.document.documentElement.style.overflow = 'hidden';
        } else {
            window.document.documentElement.style.overflow = '';
        }
        return ()=>{
            window.document.documentElement.style.overflow = '';
        }
    }, [isUnwrapped]);

    return <div className="proCard_wrapper">
        <div className="proCard_title">{title}</div>
        <div className="proCard_technologies">
            {technologies.map(tech=>{
                return <div className="proCard_technology">{tech}</div>
            })}
        </div>
        <div className="proCard_center">
            <div className={`proCard_img ${isUnwrapped ? 'proCard_img_unwrapped': ''}`}>
                {isUnwrapped && <button className='proCard_full_exit' onClick={()=>{setUnwrapped(false)}}>exit</button>}
                {!isUnwrapped && isRunned && <button className='proCard_full_exit' onClick={()=>{setUnwrapped(true)}}>fullscreen</button>}
                <div className="proCard_img_content">
                    {!isRunned && <img className="proCard_img_ext" src={imgs[0]} />}
                    {!isRunned && <button className="proCard_runDemo" onClick={()=>setRunned(true)}>Load demo</button>}
                    {isRunned && <iframe className="demo_iframe" src={gameUrl}></iframe>}
                </div>
            </div>
            <div className="proCard_text">
               {gameText}
            </div>
        </div>
        <div className="proCard_links">
            {/*<div className="proCard_link" onClick={()=>{
                setUnwrapped(true);
            }}>Fullscreen</div>*/}
            <div className="proCard_link">Play original</div>
            <div className="proCard_link">Source</div>
        </div>
    </div>
}