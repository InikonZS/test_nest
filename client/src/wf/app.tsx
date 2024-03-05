import React, { useEffect, useState } from "react";
import { IVector } from "./core/IVector";
import './app.css';
import { Game } from './core/game';
import { Collectable } from "./core/collectable";
import { GameScreen } from "./components/gameScreen/gameScreen";
import { CarPopup } from "./components/carPopup/carPopup";
import { PlanePopup } from "./components/planePopup/planePopup";

export function App(){
    const [game, setGame] = useState<Game>(null);
    const [fix, setFix] = useState(0);
    const [showCarPopup, setShowCarPopup] = useState(false); 
    const [showPlanePopup, setShowPlanePopup] = useState(false); 

    useEffect(()=>{
        const _game = new Game();
        _game.onChange=()=>(setFix(last=>last+1));
        setGame(_game);
    }, []);

    return <div className="wf_wrapper">
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
    </div>
}