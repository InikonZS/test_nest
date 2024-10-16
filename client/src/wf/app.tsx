import React, { useEffect, useRef, useState } from "react";
import { IVector } from "./core/IVector";
import './app.css';
import { Game } from './core/game';
import { Collectable } from "./core/collectable";
import { GameScreen } from "./components/gameScreen/gameScreen";
import { CarPopup } from "./components/carPopup/carPopup";
import { WinPopup } from "./components/winPopup/winPopup";
import { PlanePopup } from "./components/planePopup/planePopup";
import { AssetsLoader, IAssets } from "./assetsLoader";
import { AssetsContext } from "./assetsContext";
import { MainMenu } from './components/mainMenu/mainMenu';
import { levels } from './core/levels';
import { MessageView } from './components/message/message';
import { IMessageData } from "./components/message/IMessageData";
import { Bot } from "./core/bot";

export function App(){
    const [game, setGame] = useState<Game>(null);
    const [fix, setFix] = useState(0);
    const [showCarPopup, setShowCarPopup] = useState(false); 
    const [showPlanePopup, setShowPlanePopup] = useState(false); 
    const [assets, setAssets] = useState<IAssets>({});
    const [isAssetsLoaded, setAssetsLoaded] = useState(false);
    const [selectedLevelId, setSelectedLevelId] = useState(-1);
    const [levelStatuses, setLevelStatuses] = useState<Array<string>>([]);
    const [messages, setMessages] = useState<Array<IMessageData>>([]);

    const wrapRef = useRef<HTMLDivElement>();

    useEffect(()=>{
        const levelData = levels[selectedLevelId];
        if (!levelData){
            console.log('no level data', selectedLevelId);
            return;
        }
        const _game = new Game(levels[selectedLevelId]);
        _game.onChange=()=>{
            setFix(last=>last+1);
            bot.handleChanges();
        };
        _game.onMessage=(message)=>{
            setMessages(last=> ([...last, {id: Date.now()+Math.random(), message}]));
        };

        const bot = new Bot(_game);
        bot.handleChanges();
        setGame(_game);
        return ()=>{
            _game.destroy();
            bot.destroy();
            setGame(null);
        }
    }, [selectedLevelId]);

    useEffect(()=>{
        const loader = new AssetsLoader();
        loader.load().then(()=>{
            setAssets(loader.assets);
            setAssetsLoaded(true);
        });
    }, []);

    const [scale, setScale] = useState(1);

    useEffect(() => {
        console.log(wrapRef.current);
        if (!wrapRef.current?.parentElement){
            setFix(last=>last+1);
            return;
        }
        const resize = () => {
          const width = wrapRef.current.parentElement.getBoundingClientRect().width;//window.innerWidth;
          const height = wrapRef.current.parentElement.getBoundingClientRect().height;//window.innerHeight;
          let w = 800;
          let h = 565;
          //always use MAX-, not MIN- its important for == state
          /*if (matchMedia('(max-aspect-ratio: 1/1)').matches){
            w = 780;
            h = 1130;
          }*/
          const aspect = h / w;
          const size = Math.min(height / aspect, width);
          setScale(size / w);
          console.log(size / w);
        }
        window.addEventListener('resize', resize);
        //window.onresize = resize;
        resize();
        return () => {
          window.removeEventListener('resize', resize);
        }
      }, [wrapRef.current, isAssetsLoaded]);
    
      useEffect(() => {
        const parent = wrapRef.current;
        if (!parent){
            return;
        }
        parent.style.setProperty('--base', scale.toString() + 'px');
      }, [scale, wrapRef.current]);

    return <AssetsContext.Provider value={{assets}}>
        {!isAssetsLoaded && <div>Loading assets...</div>}
        {isAssetsLoaded && <div ref={wrapRef} className="wf_wrapper">
            {
                !game && <MainMenu onSelectLevel={(levelId)=>{
                    setSelectedLevelId(levelId);
                }} levelStatuses={levelStatuses} onChangeLevelStatuses={(id)=>{
                    setLevelStatuses(last=>{
                        const next = [...last];
                        next[id] = 'completed';
                        return next;
                    });
                }}></MainMenu>
            }
            {
                game && <GameScreen gameModel={game}
                    onCarPopupShow={()=>{
                        game.car.resetItems();
                        setShowCarPopup(true);
                    }}
                    onPlanePopupShow={()=>setShowPlanePopup(true)}
                    onClose={()=>{setSelectedLevelId(-1)}}
                ></GameScreen>
            }
            {
                showCarPopup && <CarPopup gameModel={game} onClose={()=>{
                    game.car.resetItems();
                    setShowCarPopup(false);
                }}></CarPopup>
            }
            {
                showPlanePopup && <PlanePopup gameModel={game} onClose={()=>{
                    setShowPlanePopup(false);
                }}></PlanePopup>
            }
                        {
                game && game.isWon && <WinPopup gameModel={game} onClose={()=>{
                    setLevelStatuses(last=>{
                        const next = [...last];
                        next[selectedLevelId] = 'completed';
                        return next;
                    });
                    setSelectedLevelId(-1);
                }}></WinPopup>
            }
            {
                messages.map(it=>{
                    return <MessageView key={it.id} data={it} onClosed={()=>{
                        setMessages(last=> last.filter(jt=>jt.id != it.id));
                    }}></MessageView>
                })
            }
        </div>}
    </AssetsContext.Provider>
}