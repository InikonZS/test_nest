import React, { useEffect, useRef, useState } from "react";
import "./views.css";
import "./views1.css";
import "./components/card/card.css"
import { BotPlayer, BotPlayer1, Card, Cards, Player } from "./cards";

/*const testMoves = [
    {
        type: 'deck',
        player: 0
    },
    {
        type: 'deck',
        player: 1
    },
    {
        type: 'deck',
        player: 2
    },
    {
        type: 'deck',
        player: 0
    },
    {
        type: 'deck',
        player: 1
    },
    {
        type: 'deck',
        player: 2
    }
];*/

const testMoves1 = new Array(36).fill(0).map((it, i)=>{
    return {
        type: 'deck',
        player: i % 5
    }
})

const testMoves2 = new Array(36 + 18).fill(0).map((it, i)=>{
    if (i % 3 == 0){
        return {
            type: 'attack',
            player: i % 5
        }
    } 
    if (i % 3 == 1){
        return {
            type: 'defend',
            player: (i + 1) % 5
        }
    } 
    if (i % 3 == 2){
        return {
            type: 'turn',
        }
    } 
})

const testMoves = [...testMoves1, ...testMoves2];

const deckPositions = new Array(36).fill(null).map((it, i)=>{
    if (i==0) {
        return `translate(${120 + i*3}px, 100px) rotate(${90+ Math.random() *  12-6}deg) scale(0.3)`
    }
    return `translate(${140 + i*3}px, 100px) rotate(${ Math.random() *  12-6}deg) scale(0.3)`
    //return `translate(${500 + Math.random() *  30}px, ${90 + Math.random() *  30}px) rotate(${i * 10}deg) scale(0.3)`
})

const attackPos = new Array(6).fill(null).map((it, i)=>{
    return `translate(${140 + i*70}px, 210px) rotate(10deg) scale(0.5)`
})
const defendPos = new Array(6).fill(null).map((it, i)=>{
    return `translate(${150 + i*70}px, 220px) rotate(20deg) scale(0.5)`
})

const turnPos = new Array(36).fill(null).map((it, i)=>{
    return `translate(${500 + Math.random() *  30}px, ${90 + Math.random() *  30}px) rotate(${i * 10}deg) scale(0.3)`
})


const playerPos = [
    {
        x: 0,
        y: 0
    },
    {
        x: 325,
        y: 0
    },
    {
        x: 650,
        y: 0
    },
    {
        x: 0,
        y: 250
    },
    {
        x: 650,
        y: 250
    }
]
function getPlayerCardTransform(player: number, index: number, length: number){
    return `translate(${(playerPos[player].x + (index - (length-1) / 2)*5)}px, ${playerPos[player].y}px) rotate(${(index - (length-1) / 2)*Math.min((120/length), 15)}deg) translateY(${-20}px) scale(0.3)`
}

function getMyCardTransform(index: number, length: number){
    return `translate(${(300 + (index - (length-1) / 2)*15)}px, ${400}px) rotate(${(index - (length-1) / 2)*Math.min((120/length), 15)}deg) translateY(${-20}px) scale(0.5)`
}

function CardViewTr({ value, type,  selected, zindex }: {value: number, type: number, selected: boolean, zindex: number}) {
    return (
        <div className='card' style={{'z-index': zindex, '--c-phase': selected?100:0}}>
            <div className='card_base card_a card_img' style={{ '--value': value + 1, '--type': type }} >
                {value}
            </div>
            <div className='card_base card_b  card_img' style={{ '--value': 2, '--type': 4 }}>
            </div>
        </div>
    )
}

export function Views(){
    const [cardsPos, setCardsPos] = useState<Array<{transform: string, card: Card, open: boolean, zindex: number}>>(new Array(36).fill(null).map(it=>{
        return {transform: '', card: new Card(0,0,0), open: false, zindex:0}
    }));
    
    const [game, setGame] = useState<Cards>(null);
    const [tick, setTick] = useState(0);
    const [myPlayer, setMyPlayer] = useState<Player>(null);

    useEffect(()=>{
        const _game = new Cards();
        _game._onGameState.push(()=>{
            setTick(last=> last+1);
        })
        setGame(_game);
        const players = [
            _game.addPlayer(),
            _game.addPlayer(),
          //  _game.addPlayer(),
          //  _game.addPlayer()
        ];
        new BotPlayer(players[0]);
        new BotPlayer1(players[1]);
        //players.map(it=> new BotPlayer(it));
        const _myPlayer = _game.addPlayer();
       _myPlayer.onGameState = ()=>{

        }
        setMyPlayer(_myPlayer);
        _game.start();
    }, []);

    /*useEffect(()=>{
        setCardsPos({transform: deckPositions, card: {}});
    }, []);*/

    useEffect(()=>{
        if (game){
            setCardsPos(last=>{
                const next = [...last];
                game.deck.forEach((card, cardIndex)=>{
                    next[card.id] = {transform: deckPositions[cardIndex], card: card, open: cardIndex==0?true: false, zindex: cardIndex}
                })
                game.players.forEach((player, playerIndex)=>{
                    player.cards.forEach((card, cardIndex, cards) => {
                        if (playerIndex == myPlayer?.index){
                            next[card.id] = {transform: getMyCardTransform(cardIndex, cards.length), card: card, open: true, zindex: cardIndex + 72}
                        } else {
                            next[card.id] = {transform: getPlayerCardTransform(playerIndex, cardIndex, cards.length), card: card, open: false, zindex: cardIndex + 72}
                        }
                    })
                })
                game.currentPairs.forEach((pair, pairIndex)=>{
                    next[pair.attack.id] = {transform: attackPos[pairIndex], card: pair.attack, open: true, zindex: pairIndex + 36}
                    if (pair.defend){
                        next[pair.defend.id] = {transform: defendPos[pairIndex], card: pair.defend, open: true, zindex: pairIndex + 6 + 36}
                    }
                });
                game.history.flat().forEach((pair, pairIndex)=>{
                    next[pair.attack.id] = {transform: turnPos[pairIndex*2], card: pair.attack, open: false, zindex: pairIndex*2}
                    if (pair.defend){
                        next[pair.defend.id] = {transform: turnPos[pairIndex*2+1], card: pair.attack, open: false, zindex: pairIndex*2+1}
                    }
                })
                return next;
            })
        }
    }, [tick]);
    return <div className="v_wrapper">
        {game && <>
        <div className="v_player" style={{left: '0px', top: '0px'}}>
            0
            {game.getDefender() == 0 && game.isFoldRequested && 'fold'}
            {game.currentPlayerIndex == 0 && 'A'}
            {game.getDefender() == 0 && 'D'}
        </div>
        <div className="v_player" style={{left: '325px', top: '0px'}}>
            1
            {game.getDefender() == 1 && game.isFoldRequested && 'fold'}
            {game.currentPlayerIndex == 1 && 'A'}
            {game.getDefender() == 1 && 'D'}
        </div>
        <div className="v_player" style={{left: '650px', top: '0px'}}>
            2
            {game.getDefender() == 2 && game.isFoldRequested && 'fold'}
            {game.currentPlayerIndex == 2 && 'A'}
            {game.getDefender() == 2 && 'D'}
        </div>
        <div className="v_player" style={{left: '0px', top: '250px'}}>
            3
            {game.getDefender() == 3 && game.isFoldRequested && 'fold'}
            {game.currentPlayerIndex == 3 && 'A'}
            {game.getDefender() == 3 && 'D'}
        </div>
        <div className="v_player" style={{left: '650px', top: '250px'}}>
            4
            {game.getDefender() == 4 && game.isFoldRequested && 'fold'}
            {game.currentPlayerIndex == 4 && 'A'}
            {game.getDefender() == 4 && 'D'}
        </div>
        {myPlayer && <div className="v_my_player" style={{left: '250px', top: '400px'}}>
            {myPlayer.index}
            {game.currentPlayerIndex == myPlayer.index && 'A'}
            {game.getDefender() == myPlayer.index && 'D'}
        </div>}
        <div className="v_table" style={{left: '150px', top: '150px'}}></div>
        </>
        }
        <div>
            test
            {game?.isFinished && <button style={{position: 'relative', 'z-index': 100}} onClick={()=>{
                game.start();
            }}>restart</button>}
            <button style={{position: 'relative', 'z-index': 100}} onClick={()=>{
                myPlayer.requestFold();
            }}>забрать</button>
            <button style={{position: 'relative', 'z-index': 100}} onClick={()=>{
                myPlayer.turn();
            }}>отбить</button>
            {game && cardsPos.map(it=> <div className="views_card" style={{ transition: '400ms', transform: it.transform, 'z-index':it.zindex.toString()}}
            onClick={()=>{
                if (myPlayer.cards.find(card=>{
                    return it.card.id == card.id
                })){
                    if (myPlayer.game.getDefender() == myPlayer.index){
                        myPlayer.defend(it.card, myPlayer.game.currentPairs.find(pair=> pair.defend == null).attack);
                    }
                    if (myPlayer.game.currentPlayerIndex == myPlayer.index){
                        myPlayer.attack(it.card);
                    }
                }
            }}><CardViewTr value={it.card.value} type={it.card.type} selected={!it.open} zindex={it.zindex}></CardViewTr></div>)}   
        </div>
    </div>
}

export function Views2(){
    const [playerCards, setPlayerCards] = useState([1]);
    const [moveIndex, setMoveIndex] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [initial, setInitial] = useState('');
    const [dest, setDest] = useState('');
    const [deckTop, setDeckTop] = useState(0);
    const [cardsPos, setCardsPos] = useState<Array<string>>(new Array(36).fill(''));
    const [playersLength, setPlayersLength] = useState(new Array(6).fill(0).map(it=>[]));
    const [moveCards, setMoveCards] = useState<Array<number>>([]);
    useEffect(()=>{
        setCardsPos(deckPositions);
    }, []);

    useEffect(()=>{
        console.log(testMoves[moveIndex].type, JSON.stringify(moveCards));
        if (testMoves[moveIndex].type == 'deck'){
            setDeckTop(last=> last+1);
            setCardsPos(last=> {
                const newPos = [...last];
                newPos[newPos.length-deckTop-1] = getPlayerCardTransform(testMoves[moveIndex].player, playerCards.length, playerCards.length +1);
                return newPos;
            });
            setPlayersLength(last=> {
                const next = [...last];
                next[testMoves[moveIndex].player].push(deckTop);
                return next;
            })

        }
        if (testMoves[moveIndex].type == 'attack'){
            //setDeckTop(last=> last+1);
            const ps = cardsPos.length-playersLength[testMoves[moveIndex].player][0]-1;
            setMoveCards(last1=>{
                    const next = [...last1];
                    next.push(ps);
                    return next;
                })
            setCardsPos(last=> {
                const newPos = [...last];
                
                newPos[ps] = attackPos[0];
                
                return newPos;
            });
            setMoveCards(last=>{
                const next = [...last];
                next.push(cardsPos.length-playersLength[testMoves[moveIndex].player][0]);
                return next;
            })
            setPlayersLength(last=> {
                const next = [...last];
                next[testMoves[moveIndex].player].shift();
                return next;
            })
        }

        if (testMoves[moveIndex].type == 'defend'){
            //setDeckTop(last=> last+1);
            const ps = cardsPos.length-playersLength[testMoves[moveIndex].player][0]-1;
            setMoveCards(last1=>{
                    const next = [...last1];
                    next.push(ps);
                    return next;
                })
            setCardsPos(last=> {
                const newPos = [...last];
                
                newPos[ps] = defendPos[0];
                
            
                return newPos;
            });
            
            setPlayersLength(last=> {
                const next = [...last];
                next[testMoves[moveIndex].player].shift();
                return next;
            })
        }

        if (testMoves[moveIndex].type == 'turn'){
            //setDeckTop(last=> last+1);
            setCardsPos(last=> {
                const newPos = [...last];
                moveCards.map(it=>{
                    newPos[it] = turnPos[0];
                });
                //newPos[newPos.length-playersLength[testMoves[moveIndex].player][0]-1] = turnPos[0];
                return newPos;
            });
            setMoveCards(last=>{
                const next = [...last];
                return [];
            })

            
        }
        setTimeout(()=>{
                if (moveIndex < testMoves.length - 1){
                    setMoveIndex(last=> last+1); 
                }
            },600); 
    }, [moveIndex]);

    useEffect(()=>{
        setCardsPos(last=> {
            const newPos = [...last]; 
            playersLength.forEach((playerCards, playerIndex)=>{
                playerCards.forEach((cardIndex, cardId)=>{
                    newPos[newPos.length-cardIndex-1] = getPlayerCardTransform(playerIndex, cardId, playerCards.length);
                })
            
            })
            return newPos;
        });
       
    }, [playersLength]);

    /*useEffect(()=>{
        setInitial(deckPositions[deckPositions.length-1 - deckTop]);
        setDeckTop(last=> last+1);
        const i = 3;
        setDest(getPlayerCardTransform(testMoves[moveIndex].player, playerCards.length, playerCards.length +1));
        setTimeout(()=>{
        requestAnimationFrame(()=>{
            setAnimate(true);  
        })},500)

        setTimeout(()=>{
            setPlayerCards(last => new Array(last.length+1).fill(1))
            setAnimate(false)
            if (moveIndex < testMoves.length - 1){
                setMoveIndex(last=> last+1); 
            }
        },1500); 
    }, [moveIndex]);*/

    return <div className="v_wrapper">
        {/*<div className="views_player" style={{left: '300px'}}>
                {playerCards.map((it, i)=>{
                    return <div className="views_slot2" style={{'transform-origin': 'center bottom', transform: `translate(${i*5}px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
                })}
            </div>
        <div className="v_table" style={{left: '50px', top: '250px'}}>
            <div className="v_pair">
                <div className="views_slot" style={{transform: 'translate(0px, 0px) rotate(10deg)'}}></div>
                <div className="views_slot" style={{transform: 'translate(20px, 20px) rotate(20deg)'}}></div>
            </div>

            <div className="v_pair" style={{left: '200px'}}>
                <div className="views_slot" style={{transform: 'translate(0px, 0px) rotate(10deg)'}}></div>
                <div className="views_slot" style={{transform: 'translate(20px, 20px) rotate(20deg)'}}></div>
            </div>

            <div className="v_pair" style={{left: '400px'}}>
                <div className="views_slot" style={{transform: 'translate(0px, 0px) rotate(10deg)'}}></div>
                <div className="views_slot" style={{transform: 'translate(20px, 20px) rotate(20deg)'}}></div>
            </div>
        </div>*/}
        <div className="v_player" style={{left: '0px', top: '0px'}}>
        </div>
        <div className="v_player" style={{left: '325px', top: '0px'}}>
        </div>
        <div className="v_player" style={{left: '650px', top: '0px'}}>
        </div>
        <div className="v_player" style={{left: '0px', top: '250px'}}></div>
        <div className="v_player" style={{left: '650px', top: '250px'}}></div>
        <div className="v_my_player" style={{left: '250px', top: '400px'}}></div>
        <div className="v_table" style={{left: '150px', top: '150px'}}></div>
        {/*<div>
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${(i - (playerCards.length-1) / 2)*5}px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${325 + (i - (playerCards.length-1) / 2)*5}px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${650 + (i - (playerCards.length-1) / 2)*5}px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}

            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${(i - (playerCards.length-1) / 2)*5}px, 250px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${325 + (i - (playerCards.length-1) / 2)*10}px, 450px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-50}px) scale(0.5)`}}></div>
            })}
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${650 + (i - (playerCards.length-1) / 2)*5}px, 250px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}
            {deckPositions.slice(0, deckPositions.length - deckTop).map((it, i)=>{
                return <div className="views_slot" style={{transform:it}}></div>
                //if (i==0) {
                //    return <div className="views_slot" style={{transform: `translate(${120 + i*3}px, 100px) rotate(${90+ Math.random() *  12-6}deg) scale(0.3)`}}></div>
                //}
                //return <div className="views_slot" style={{transform: `translate(${140 + i*3}px, 100px) rotate(${ Math.random() *  12-6}deg) scale(0.3)`}}></div>
            })}
            {new Array(36).fill(null).map((it, i)=>{
                return <div className="views_slot" style={{transform: `translate(${500 + Math.random() *  30}px, ${90 + Math.random() *  30}px) rotate(${i * 10}deg) scale(0.3)`}}></div>
            })}
            {new Array(6).fill(null).map((it, i)=>{
                return <>
                    <div className="views_slot" style={{transform: `translate(${140 + i*70}px, 210px) rotate(10deg) scale(0.5)`}}></div>
                    <div className="views_slot" style={{transform: `translate(${150 + i*70}px, 220px) rotate(20deg) scale(0.5)`}}></div>
                </>
            })}
            <div className="views_card" style={{transition: animate ? '1s': '0s', transform: animate ? dest : initial}}></div>

            
        </div>*/}
        <div>
         {cardsPos.map(it=> <div className="views_card" style={{transition: '400ms', transform: it}}></div>)}   
        </div>
        
    </div>
}

export function Views1(){
    const [animate, setAnimate] = useState(false);
    const [initial, setInitial] = useState('');
    const playerCards = [1,2,3,4,5,6,7,8,9];
    const slot2 = useRef<HTMLDivElement>();
    const slot3 = useRef<HTMLDivElement>();
    const playerDiv = useRef<HTMLDivElement>();
    const animationList = [2, 5, 3, 6, 7, 1, 0];
    const [aniPosition, setAniPosition] = useState(0);
    const deck = [1,2,3,4,5,6,7,8];

    useEffect(()=>{
        console.log('animate ', aniPosition);
        const positions = [...playerDiv.current.children].map(it => (window.getComputedStyle(it)));
        const transforms = [...playerDiv.current.children].map(it => window.getComputedStyle(it).transform);
        console.log(window.getComputedStyle(playerDiv.current).left);
        console.log(positions);
        const slotIndex = animationList[aniPosition]//Math.floor(Math.random()*positions.length);
        setInitial(`translate(${300 * 1}px, ${0}px) ${transforms[slotIndex]} rotateY(180deg)`)
        //setTimeout(()=>{
        requestAnimationFrame(()=>{
            setAnimate(true);  
        })
          
        //},500); 
        setTimeout(()=>{
            setAnimate(false)
            if (aniPosition + 1 < animationList.length){
                setAniPosition(last=> last+1); 
            }
        },1500); 
    }, [aniPosition]);
    return <div>
       <div className="views_container">
            <div className="views_player" ref={playerDiv} style={{left: '300px'}}>
                {playerCards.map((it, i)=>{
                    return <div className="views_slot2" style={{transform: `translate(${i*20}px) rotate(${i*15}deg) scale(0.3)`}}></div>
                })}
            </div>
            <div className="views_player" style={{}}>
                {playerCards.map((it, i)=>{
                    return <div className="views_slot2" style={{transform: `translate(${i*20}px) rotate(${i*15}deg) scale(0.3)`}}></div>
                })}
            </div>
            <div className="views_player" ref={playerDiv} style={{left: '600px'}}>
                {deck.map((it, i)=>{
                    return <div className="views_slot2" style={{transform: `translate(${i*10}px) scale(0.3)`}}></div>
                })}
            </div>
            <div ref={slot2} className="views_slot" style={{transform: 'translate(400px, 300px) rotate(50deg)'}}></div>
            <div ref={slot3} className="views_slot" style={{transform: 'translate(420px, 320px) rotate(60deg)'}}></div>
            <div className="views_card" style={{transition: animate ? '1s': '0s', transform: animate ? window.getComputedStyle(slot2.current).transform : initial}}></div>
        </div> 
        <button onClick={()=>{
            if (animate){
                setAnimate(false);
                return;
            }
            console.log(window.getComputedStyle(slot2.current).transform);
            const positions = [...playerDiv.current.children].map(it => (window.getComputedStyle(it)));
            const transforms = [...playerDiv.current.children].map(it => window.getComputedStyle(it).transform);
            console.log(window.getComputedStyle(playerDiv.current).left);
            console.log(positions);
            const slotIndex = Math.floor(Math.random()*positions.length);
            setInitial(`translate(${300 * 1}px, ${0}px) ${transforms[slotIndex]} rotateY(180deg)`)
            setTimeout(()=>{
              setAnimate(true);  
            },500);
        }}>animate</button>

        <button onClick={()=>{

        }}>
            list
        </button>
    </div>
    
}