import React, { useEffect, useState } from "react";
import { IVector } from "./core/IVector";
import './app.css';
import { Game } from './core/game';
import { Collectable } from "./core/collectable";
import { GameScreen } from "./components/gameScreen/gameScreen";
import { CarPopup } from "./components/carPopup/carPopup";
import { PlanePopup } from "./components/planePopup/planePopup";
import { AssetsLoader, IAssets } from "./assetsLoader";
import { AssetsContext } from "./assetsContext";

export function App(){
    const [game, setGame] = useState<Game>(null);
    const [fix, setFix] = useState(0);
    const [showCarPopup, setShowCarPopup] = useState(false); 
    const [showPlanePopup, setShowPlanePopup] = useState(false); 
    const [assets, setAssets] = useState<IAssets>({});
    const [isAssetsLoaded, setAssetsLoaded] = useState(false);

    useEffect(()=>{
        const _game = new Game();
        _game.onChange=()=>(setFix(last=>last+1));
        setGame(_game);
    }, []);

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
                game && <GameScreen gameModel={game}
                    onCarPopupShow={()=>setShowCarPopup(true)}
                    onPlanePopupShow={()=>setShowPlanePopup(true)}
                ></GameScreen>
            }
            {
                showCarPopup && <CarPopup gameModel={game} onClose={()=>setShowCarPopup(false)}></CarPopup>
            }
            {
                showPlanePopup && <PlanePopup gameModel={game} onClose={()=>setShowPlanePopup(false)}></PlanePopup>
            }
        </div>}
    </AssetsContext.Provider>
}