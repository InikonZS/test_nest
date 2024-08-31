import React from "react";
import { ProCard } from "../ui/components/proCard/proCard";
import { Views } from "../cards/views";

const bricksProject = {
    title: 'Bricks game',
    technologies: ['Released Game', 'React', 'TypeScript'],
    imgs: ['https://inikonzs.github.io/no_build_demos/index_assets/bricks_screen1.png'],
    gameUrl: 'https://aquamarine-cucurucho-8f39a2.netlify.app/',
    sourceUrl: 'https://github.com/InikonZS/bricks_game',
    gameText: (
        <>
            Implementaion of one old game about coloured bricks available to play in browser.
            <p>
                Main mission of game - clear all field. Click the side bars to shot a colored block. There are need to collect 3 or more bricks with same color together like polymino to remove them. Initial bricks has not direction, but bricks you shot from side bars saves the direction and continue moving as soon as next cell got free.
            </p>
            <p>
                Game contains custom level generator where you can select colors count (2 - 12) and field size. There are also several presetted challenging levels from most easy one to almost impossible to complete it.
            </p>
        </>
    )
}

const gamePoker = {
    title: 'Texas Holdem Poker',
    technologies: ['Game', 'React'],
    imgs: ['https://inikonzs.github.io/no_build_demos/index_assets/poker_screen1.png', 'https://inikonzs.github.io/no_build_demos/index_assets/poker_screen2.png'],
    gameUrl: 'https://poker-game-online.netlify.app/',
    sourceUrl: 'https://github.com/sleepyComrade/Poker',
    gameText: 'Multiplayer and single poker game. Written with React, Typescript for client and Node, Websocket for server'
}

const gameCards = {
    title: 'Cards',
    technologies: ['Game', 'React'],
    GameComponent: Views,
    gameUrl: '#cards', 
    gameText: 'Card game implementation. Available to play with bots, number of bots can be selected from 1 to 5'
}

export function App(){
    return <div>
        <ProCard {...bricksProject} ></ProCard>
        <ProCard {...gamePoker} ></ProCard>
        <ProCard {...gameCards} ></ProCard>
        <ProCard 
            title="Walk around 3d cubes" 
            technologies={['JavaScript', 'Canvas']} 
            gameUrl="https://inikonzs.github.io/no_build_demos/canvas3d/index.html" 
            gameText="3d first person camera control demo, walking with AWSD and Space key for jump. Written with pure javascript and canvas 2d rendering context. Click at game area hide the mouse cursor for correct shooter camera handling."
        />
        <ProCard 
            title="Blinking elements" 
            technologies={['JavaScript', 'HTML']} 
            gameUrl="https://inikonzs.github.io/no_build_demos/blink_trace/index.html" 
            gameText="Demo shows synchronized diagonal blinking for many elements on the page with different sizes and positions. Demo uses css animation and linear gradient for blinking effect. Range input allows to change angle of blinking ray for next iteration."
        />
        {/*<Slot></Slot>*/}
    </div>
}