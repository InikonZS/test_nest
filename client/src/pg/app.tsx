import React from "react";
import './app.css';
import { ProCard } from "../ui/components/proCard/proCard";
import { SmallCard } from "./smallCard/smallCard";
import { Footer } from "./footer/footer";
import { TopSection } from "./topSection/topSection";
import { Views } from "../cards/views";
import { App as Three } from "../three/app";
//import { App as Pixels } from "../pixels/app";
//import { App as Ani} from "./ani/app";
import { App as Word} from "../word/app";
import { App as Wf} from "../wf/app";

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
    imgs: ["https://inikonzs.github.io/no_build_demos/index_assets/cards.png"],
    sourceUrl: "https://github.com/InikonZS/test_nest/tree/master/client/src/cards",
    gameText: 'Card game implementation. Available to play with bots, number of bots can be selected from 1 to 5'
}

export function App(){
    return <div className="pg_page">
        <TopSection></TopSection>
        <ProCard {...bricksProject} ></ProCard>
        <ProCard {...gamePoker} ></ProCard>
        <ProCard 
            title="Farm Simulator" 
            technologies={['Game', 'React']}
            imgs={['https://inikonzs.github.io/no_build_demos/index_assets/wf1.png',
                'https://inikonzs.github.io/no_build_demos/index_assets/wf2.png',
                'https://inikonzs.github.io/no_build_demos/index_assets/wf3.png'
            ]}
            gameUrl="#wf" 
            sourceUrl="https://github.com/InikonZS/test_nest/tree/master/client/src/wf"
            GameComponent={Wf}
            gameText="Single player game. Build factories, buy animals, sell products"
        />
        <ProCard {...gameCards} ></ProCard>
        <ProCard 
            title="Word Field" 
            technologies={['Game', 'React']}
            imgs={['https://inikonzs.github.io/no_build_demos/index_assets/wordfield.png',
            ]}
            gameUrl="#word" 
            sourceUrl="https://github.com/InikonZS/test_nest/tree/master/client/src/word"
            GameComponent={Word}
            gameText="Single player word field game. Collect longest word having 7 letters on hand vs perfect bot"
        />
        <ProCard 
            title="Fruit Three" 
            technologies={['Game', 'React']}
            imgs={['https://inikonzs.github.io/no_build_demos/index_assets/fruitthree.png']}
            gameUrl="#three" 
            sourceUrl="https://github.com/InikonZS/test_nest/tree/master/client/src/three"
            GameComponent={Three}
            gameText="Three in row implementation"
        />
        <ProCard 
            title="Words game" 
            technologies={['Game', 'React']}
            imgs={['https://inikonzs.github.io/no_build_demos/index_assets/words_screen1.png']}
            gameUrl="https://words-game-online.netlify.app/" 
            sourceUrl="https://github.com/InikonZS/words"
            gameText="Multiplayer and single words game. Written with React, Typescript for client and Node, Websocket for server. Find words at 10x10 field in English, Russian, Belorussian and Polish languages with bot of friends."
        />
        <ProCard 
            title="XO Game" 
            technologies={['Game', 'Pixi', 'Spine']}
            imgs={['https://inikonzs.github.io/no_build_demos/index_assets/xo_screen1.png']}
            gameUrl="https://fabulous-fox-7b966d.netlify.app/" 
            sourceUrl="https://github.com/InikonZS/xo_game"
            gameText="Single player Pixi.js example cross-circles game"
        />
        <ProCard 
            title="Horns" 
            technologies={['Game', 'TypeScript', 'Canvas']}
            imgs={['https://inikonzs.github.io/no_build_demos/index_assets/horns_screen1.png', 'https://inikonzs.github.io/no_build_demos/index_assets/horns_screen2.png']}
            gameUrl="https://inikonzs-rs-clone-horns.netlify.app/" 
            sourceUrl="https://github.com/InikonZS/Horns"
            gameText="Worms clone written with TypeScript for RSClone task."
        />
        <ProCard 
            title="Star Fighter" 
            technologies={['Game', 'TypeScript', 'Canvas', 'WebGL']}
            imgs={['https://inikonzs.github.io/no_build_demos/index_assets/star_screen1.png']}
            gameUrl="https://inikon-ragneda-star-fighter.netlify.app/" 
            sourceUrl="https://github.com/InikonZS/star-fighter"
            gameText="3d space shooter, written with pure javascript and webgl."
        />
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

        <div className="pg_other_projects">
            <div className="pg_other_projects_wrapper">
                <div className="pg_other_projects_title">There are some of undone and unsorted examples</div>
                <div className="pg_other_projects_text">Maybe code of these can be usefull or later something will become a base for real project.</div>
                <div className="pg_other_projects_list">
                    <SmallCard {...{
                        title: 'Tracers',
                        gameText: 'Big collection of math demos, at first about tracing optimization and logics of real time strategy games, and some other math demos. Of course it almost impossible to undestand easy, so this big repo isn\'t placed among main projects.',
                        imgs: [
                            'https://inikonzs.github.io/no_build_demos/index_assets/math_screen1.png', 
                            'https://inikonzs.github.io/no_build_demos/index_assets/math_screen2.png'
                        ],
                        gameUrl: 'https://inspiring-cocada-97ef0e11.netlify.app/',
                        sourceUrl: 'https://github.com/InikonZS/tracer'
                    }}></SmallCard>
                    <SmallCard
                    {...{
                        title: 'Splayer SVG Editor',
                        gameText: 'One of my first web projects, originaly it should be a tools to light-weight manual tracer for electronic boards, but later changed to svg editor with strict grid. Quite useless and undone, but presented as is.',
                        imgs: [
                            'https://inikonzs.github.io/no_build_demos/index_assets/splayer_screen1.png'
                        ],
                        gameUrl: '',
                        sourceUrl: 'https://github.com/InikonZS/splayer'
                    }}></SmallCard>
                    <SmallCard
                    {...{
                        title: 'Chess Multiplayer',
                        gameText: 'Single and multiplayer chess game. It was one of RS-Clone project written with students team. Currently there are no any deployed demo. It was builded with old architecture and impossible to run it client-only, but sources can be upped locally.',
                        imgs: [
                            'https://inikonzs.github.io/no_build_demos/index_assets/chess_screen1.png'
                        ],
                        gameUrl: '',
                        sourceUrl: 'https://github.com/InikonZS/gameserv/tree/new-view6'
                    }}></SmallCard>
                </div>
            </div>
            
        </div>
        <Footer></Footer>
        {/*<Slot></Slot>*/}
    </div>
}