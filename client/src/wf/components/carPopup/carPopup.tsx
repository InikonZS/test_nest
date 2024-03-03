import React, { useEffect, useState } from "react";
import './carPopup.css';
import { Game } from "../../core/game";
import {countItems} from "../../core/utils";

interface ICarPopupProps {
    onClose: () => void;
    gameModel: Game;
}

export function CarPopup({ onClose, gameModel }: ICarPopupProps) {
    const game = gameModel;
    const storageSum = game ? countItems(game.storage.items) : {};
    const carSum = game ? countItems(game.car.items) : {};

    return <div className="wf_carPopup">
        <button onClick={onClose}>close</button>
        <div>
            {Object.keys(storageSum).map(it => {
                return <div>
                    <div>{it} - {storageSum[it]}</div>
                    <button onClick={() => {
                        const items = game.storage.items.filter(jt => jt.type == it);
                        game.storage.items = game.storage.items.filter(jt => jt != items[0])
                        game.car.items.push(items[0]);
                    }}>add 1</button>
                    <button onClick={() => {
                        const items = game.storage.items.filter(jt => jt.type == it);
                        game.storage.items = game.storage.items.filter(jt => !items.includes(jt));
                        game.car.items = [...game.car.items, ...items];
                    }}>add all</button>
                </div>
            })}
        </div>
        <div>

            {Object.keys(carSum).map(it => {
                return <div>
                    <div>{it} - {carSum[it]}</div>
                    <button onClick={() => {
                    }}>remove</button>
                </div>
            })}

            <button onClick={() => {
                game.car.start();
            }}>sell</button>
        </div>
    </div>
}