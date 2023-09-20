import React, { useEffect, useState } from 'react';
import { BotPlayer, Card, Cards, Player } from './cards';
import CardView from './components/card/card';
import './cardsView.css'

/*function CardView({card}: {card:Card}){
    return <div>
        {card.value} - {card.type}
    </div>
}*/

function PlayerView({player}: {player: Player}){
    return <div className='player_cards'>
        --
        {
            player.cards.map(card=>{
                return <CardView value={card.value} type={card.type} selected={false}></CardView>
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
        <div className='deck'>
            <div className='deck_trump'>
                {game?.deck && game?.deck.length &&  <CardView value={game.deck[0].value} type={game.deck[0].type} selected={false}></CardView>}
            </div>
            <div className='deck_cards'>
                {game?.deck && (game?.deck.length > 1) && new Array(game.deck.length - 1 ).fill(null).map(it=>{
                    return <div className='deck_card'> <CardView value={0} type={0} selected={true}></CardView></div>
                })}  
            </div>
          
         
        </div>
        
        {game?.players && game.players.map(it=> <PlayerView player={it}></PlayerView>)}
        ===========
        <div className='pairs'>
        {game?.currentPairs && game.currentPairs.map(it=>{
            return <div className='pair'>
                <div className='pair_attack'>
                    attack
                    <CardView value={it.attack.value} type={it.attack.type} selected={false}></CardView>
                </div>
                <div className='pair_defend'>
                defend {it.defend && <CardView value={it.defend.value} type={it.defend.type} selected={false}></CardView>}
                </div>
            </div>
        })}   
        </div>
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