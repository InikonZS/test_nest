import React from "react";
import { AvatarEditor } from "./components/avatarEditor/avatarEditor";
import { Sparkle } from "./components/sparkle/sparkle";
import { AniSlider } from "./components/aniSlider/aniSlider";
import { ProCard } from "./components/proCard/proCard";
import { Wheel } from "./components/wheel/wheel";
import { Slot } from "./slot/slot";

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

const gameExample1 = {
    title: 'Project Title',
    technologies: ['Pixi'],
    imgs: ['https://inikonzs.github.io/no_build_demos/index_assets/xo_screen1.png', 'https://inikonzs.github.io/no_build_demos/index_assets/bricks_screen1.png'],
    gameUrl: 'https://fabulous-fox-7b966d.netlify.app/',
    gameText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cum, eveniet facere magnam ullam iusto esse, voluptatem pariatur illum soluta, fugit eligendi excepturi molestias ab temporibus doloribus officia at exercitationem?'
}

const gameExampleFunc = {
    title: 'Project Title',
    technologies: ['Pixi'],
    GameComponent: Slot,
    gameText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cum, eveniet facere magnam ullam iusto esse, voluptatem pariatur illum soluta, fugit eligendi excepturi molestias ab temporibus doloribus officia at exercitationem?'
}

export function App(){
    return <div>
        <AvatarEditor></AvatarEditor>
        {/*<Sparkle></Sparkle>*/}
        <AniSlider></AniSlider>
        <ProCard {...bricksProject} ></ProCard>
        <ProCard {...gameExample1} ></ProCard>
        <ProCard {...gameExampleFunc} ></ProCard>
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
        <Wheel></Wheel>
        {/*<Slot></Slot>*/}
    </div>
}