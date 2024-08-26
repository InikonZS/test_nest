import React from "react";
import { AvatarEditor } from "./components/avatarEditor/avatarEditor";
import { Sparkle } from "./components/sparkle/sparkle";
import { AniSlider } from "./components/aniSlider/aniSlider";
import { ProCard } from "./components/proCard/proCard";
import { Wheel } from "./components/wheel/wheel";
import { Slot } from "./slot/slot";

const gameExample = {
    title: 'Project Title',
    technologies: ['React', 'Pixi'],
    imgs: ['https://inikonzs.github.io/no_build_demos/index_assets/bricks_screen1.png'],
    gameUrl: 'https://aquamarine-cucurucho-8f39a2.netlify.app/',
    gameText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cum, eveniet facere magnam ullam iusto esse, voluptatem pariatur illum soluta, fugit eligendi excepturi molestias ab temporibus doloribus officia at exercitationem?'
}

const gameExample1 = {
    title: 'Project Title',
    technologies: ['Pixi'],
    imgs: ['https://inikonzs.github.io/no_build_demos/index_assets/xo_screen1.png'],
    gameUrl: 'https://fabulous-fox-7b966d.netlify.app/',
    gameText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cum, eveniet facere magnam ullam iusto esse, voluptatem pariatur illum soluta, fugit eligendi excepturi molestias ab temporibus doloribus officia at exercitationem?'
}

export function App(){
    return <div>
        <AvatarEditor></AvatarEditor>
        {/*<Sparkle></Sparkle>*/}
        <AniSlider></AniSlider>
        <ProCard {...gameExample} ></ProCard>
        <ProCard {...gameExample1} ></ProCard>
        <Wheel></Wheel>
        <Slot></Slot>
    </div>
}