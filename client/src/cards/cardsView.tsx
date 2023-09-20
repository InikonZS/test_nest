import React, { useEffect, useState } from 'react';
import { BotPlayer, Card, Cards, Player } from './cards';


function CardView({card}: {card:Card}){
    return <div>
        {card.value} - {card.type}
    </div>
}

function PlayerView({player}: {player: Player}){
    return <div>
        ----------------
        {
            player.cards.map(card=>{
                return <CardView card={card}></CardView>
            })
        }
    </div>
}

export function CardsView(){
    const [game, setGame] = useState<Cards>(null);
    const [tick, setTick] = useState(0);
    useEffect(()=>{
        const game = new Cards();
        game._onGameState.push(()=>{
            setTick(last=> last+1);
        })
        setGame(game);
        const players = [
            game.addPlayer(),
            game.addPlayer()
        ];
        players.map(it=> new BotPlayer(it));
        game.start();
    }, []);
    return <div>
        {game?.deck && game.deck.length}
        {game?.players && game.players.map(it=> <PlayerView player={it}></PlayerView>)}
        ===========
        {game?.currentPairs && game.currentPairs.map(it=>{
            return <div>
                attack <CardView card={it.attack}></CardView>
                defend {it.defend && <CardView card={it.defend}></CardView>}
            </div>
        })}   
        +++++
        {game?.history && game.history.map(it=>{
            return <div>
                --
                {it.map(jt=>{
                    return <div>{jt.attack.type +'_'+ jt.attack.value + ' \/ ' + jt.defend.type +'_'+ jt.defend.value}</div>
                })}
            </div>
        })}   
    </div>
}