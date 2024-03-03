import React, { useEffect, useState } from "react";
import { IVector } from "./core/IVector";
import './app.css';
import { Game } from './core/game';
import { Collectable } from "./core/collectable";

interface IAnimalData{
    position: IVector,
    lastPosition: IVector,
    health: number,
}

function Animal({animalData}: {animalData: IAnimalData}){
    const dist = Math.hypot(animalData.lastPosition.x- animalData.position.x, animalData.lastPosition.y- animalData.position.y);
    return <div className="wf_animal" style={{left: animalData.position.x, top: animalData.position.y, 'transition-duration': dist *5 +'ms'}}>
        A
    </div>
}

const colors = {
    'egg0': '#090',
    'egg1': '#f90',
    'egg2': '#f9f'
}

function countItems(items: Array< Collectable >): Record<string, number>{
    const storageSum: Record<string, number> = {};
    items.forEach(item=>{
        if (storageSum[item.type]){
            storageSum[item.type] +=1;
        } else {
            storageSum[item.type] = 1;
        }
    })
    return storageSum;
}

export function App(){
    const [game, setGame] = useState<Game>(null);
    const [fix, setFix] = useState(0);
    const [showCarPopup, setShowCarPopup] = useState(false); 

    useEffect(()=>{
        const _game = new Game();
        _game.onChange=()=>(setFix(last=>last+1));
        setGame(_game);
    }, []);

    const storageSum = game ? countItems(game.storage.items) : {};
    const carSum = game ? countItems(game.car.items) : {};

    return <div className="wf_wrapper">
        <div>money: {game && game.money}</div>
        <button onClick={()=>{
            game.addAnimal();
        }}>add</button>
        <div className="wf_field">
            {game && game.animals.map(animal=>{
                return <Animal animalData={{health:10, position: animal.position, lastPosition: animal.lastPosition}}></Animal>
            })}
            {game && game.items.map(item=>{
                return <div className="wf_item" onClick={()=>{
                    game.collect(item);
                }}
                style={{left: item.position.x, top: item.position.y, 'background-color': colors[item.type as keyof typeof colors]}}
                >B</div>
            })}
        </div>
        <div>
        {game && game.factories.map((item, i)=>{
                return <button className="" onClick={()=>game.startFactory(item)}>{i} {item.isStarted ? 'started': ''}</button>
            })}
        </div>
        <div className="wf_storage">
            {game && game.storage.items.map(item=>{
                return <div className="wf_storage_item" style={{'background-color': colors[item.type as keyof typeof colors]}}>C</div>
            })}
        </div>
        {
        showCarPopup && <div className="wf_carPopup">
            <button onClick={()=> setShowCarPopup(false)}>close</button>
            <div>
                {Object.keys(storageSum).map(it=>{
                    return <div>
                        <div>{it} - {storageSum[it]}</div>
                        <button onClick={()=>{
                            const items = game.storage.items.filter(jt=>jt.type == it);
                            game.storage.items = game.storage.items.filter(jt=>jt != items[0])
                            game.car.items.push(items[0]);
                        }}>add 1</button>
                        <button onClick={()=>{
                            const items = game.storage.items.filter(jt=>jt.type == it);
                            game.storage.items = game.storage.items.filter(jt=>!items.includes(jt));
                            game.car.items = [...game.car.items, ...items];
                        }}>add all</button>
                    </div>
                })}
            </div>
            <div>

            {Object.keys(carSum).map(it=>{
                    return <div>
                        <div>{it} - {carSum[it]}</div>
                        <button onClick={()=>{
                        }}>remove</button>
                    </div>
                })}

                <button onClick={()=>{
                    game.car.start();
                }}>sell</button>
            </div>
        </div>
        }
        <button className="wf_car" onClick={()=>{
            setShowCarPopup(true);
        }}>
            car {game && game.car.isStarted ? 'started': ''}
        </button>
    </div>
}