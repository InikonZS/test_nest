import React, { useEffect, useState } from "react";
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

export function App(){
    const [game, setGame] = useState<Game>(null);
    const [fix, setFix] = useState(0);
    const [showCarPopup, setShowCarPopup] = useState(false); 
    const [showPlanePopup, setShowPlanePopup] = useState(false); 
    const [assets, setAssets] = useState<IAssets>({});
    const [isAssetsLoaded, setAssetsLoaded] = useState(false);
    const [selectedLevelId, setSelectedLevelId] = useState(-1);
    const [levelStatuses, setLevelStatuses] = useState<Array<string>>([]);

    useEffect(()=>{
        const levelData = levels[selectedLevelId];
        if (!levelData){
            console.log('no level data', selectedLevelId);
            return;
        }
        const _game = new Game(levels[selectedLevelId]);
        _game.onChange=()=>(setFix(last=>last+1));
        setGame(_game);
        return ()=>{
            _game.destroy();
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

    return <AssetsContext.Provider value={{assets}}>
        {!isAssetsLoaded && <div>Loading assets...</div>}
        {isAssetsLoaded && <div className="wf_wrapper">
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
        </div>}
    </AssetsContext.Provider>
}