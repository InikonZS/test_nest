
import React from "react"
import { Game } from "../../core/game"
import "./animalsPanel.css";

interface IAnimalsPanelProps{
    gameModel: Game;
}

export function AnimalsPanel({gameModel}: IAnimalsPanelProps){
    return <div className="wf_animalsPanel">
        {
            Object.keys(gameModel.availableAnimals).map((id: keyof typeof gameModel.availableAnimals)=>{
                return <div className={`wf_addAnimal_item ${gameModel.checkSum(gameModel.availableAnimals[id].price) ? '' : 'wf_addAnimal_item_disabled'}`} 
                    onClick={()=>{
                        gameModel.addAnimal(id);
                    }}>
                    <div> add {id}</div> 
                    <div> price: {gameModel.availableAnimals[id].price}</div>
                </div>
            })
        }
    </div>
}