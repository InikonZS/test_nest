export class Card{
    value: number;
    type: number;
    id: number;

    constructor(value: number, type: number, id: number){
        this.value = value;
        this.type = type;
        this.id = id;
    }
}

function log(text: string){
    console.log(text);
}

export class BotPlayer {
    constructor(player: Player){
        const game = player.game;
        const defender = player.game.players[player.game.getDefender()];
        let out: any = null;
        player.onGameState = async ()=>{
            if (game.isFinished == true ){
                return;
            }
            await new Promise((res)=>{
                    clearTimeout(out);
                    out = setTimeout(()=>res(null), 500)
            })
            log('player: ' + player.index + ' - ' + game.currentPlayerIndex + ' - ' + game.getDefender() + ' deck: ' + game.deck.length + JSON.stringify(player.cards))
            if (game.currentPlayerIndex == player.index){
                
                if (defender.cards.length == 0){
                    log('no defender cards')
                    player.turn();
                }else
                if (game.currentPairs.length == 0){
                    player.attack(player.cards[Math.floor(Math.random()*player.cards.length)]);
                } else {
                    const allCards: Array<Card> = [];
                    game.currentPairs.forEach(it=>{
                        allCards.push(it.attack);
                        if (it.defend){
                            allCards.push(it.defend);
                        }
                    })
                    const addList = player.cards.filter(it=> canAdd(it, allCards));
                    if (addList.length){
                        console.log('add attack')
                        player.attack(addList[Math.floor(Math.random()*addList.length)]);
                    } else {
                        player.turn();
                    }
                }
            }

            else if (game.getDefender() == player.index){
                const opened = game.currentPairs.filter(it=>!it.defend).map(it=> it.attack);
                const actual = opened[0];
                if (actual){ 
                    log('try defend')
                    const defendOne = player.cards.filter(it=> isBeats(it, actual, game.trump))[0];
                    if (defendOne){
                        player.defend(defendOne, actual);
                    } else {
                        player.fold();
                    }
                }
                //player.attack(player.cards[Math.floor(Math.random()*player.cards.length)]);
            }
        }
    }
}

export class Player{
    cards: Array<Card> = [];
    game: Cards;
    isWin: boolean;
    index: number;
    onGameState: ()=>void;

    constructor(game: Cards, index: number){
        this.game = game;
        this.index = index;
        this.game._onGameState.push(()=>{
            this.onGameState?.();
        });
        this.isWin = false;
    }

    attack(card: Card){
        if (!card){
            return
        }
        const cardIndex = this.cards.findIndex(it=> sameCard(it, card)); 
        if (cardIndex == -1){
            throw new Error('Wrong card')
        }
        this.cards.splice(cardIndex, 1);
        this.game.attack(this, card);
    }

    defend(card: Card, attackCard: Card){
        if (!card){
            return
        }
        const cardIndex = this.cards.findIndex(it=> sameCard(it, card));
        if (cardIndex == -1){
            throw new Error('Wrong card')
        }
        this.cards.splice(cardIndex, 1);
        this.game.defend(this, card, attackCard);
    }

    turn(){
        this.game.turn(this);
    }

    fold(){
        this.game.fold(this);
    }
}

/**
 * Returns true if A beats B.
 * @param a 
 * @param b 
 * @param trump 
 * @returns 
 */
function isBeats(a: Card, b: Card, trump: number){
    if ((a.type == trump) && (b.type != trump)){
        return true;
    }

    if ((a.type == b.type) && (a.value > b.value)){
        return true;
    }
    
    return false;
}

function canAdd(a: Card, cards: Array<Card>){
    return cards.find(card=>card.value == a.value) != null;
}

function sameCard(a: Card, b: Card){
    return (a.type == b.type) && (a.value == b.value)
}

function getSequence(length: number){
    if (length == 2){
        return [0, 1]
    }

    return [0, ...new Array(length - 2).fill(0).map((_, i)=> i + 2), 1]
}

function rotateSequence(sequence: Array<number>, currentPlayer: number){
    const rotated = sequence.map(it=> (it + currentPlayer) % sequence.length);
    return rotated;
}

function createDeck(){
    const deck: Array<Card> = [];
    let id = 0;
    for (let i=4; i<13; i++){
        for (let j=0; j<4; j++){
            deck.push(new Card(i, j, id));
            id+=1;
        } 
    }
    return deck;
}

function mixDeck(deck: Array<Card>){
    const mixed: Array<Card> = [];
    const temp = [...deck];
    while (temp.length){
        const pos = Math.floor(Math.random() * temp.length);
        const item = temp[pos];
        temp[pos] = temp[temp.length - 1];
        
        temp.pop();
        if (item){
          mixed.push(item)  
        }
    }
    return mixed;
}

class Move{

}

export class Cards{
    deck: Array<Card>;
    players: Array<Player>;
    currentPlayerIndex: number = 0;
    trump: number;
    history: Array<Array<{
        attack: Card,
        defend: Card | null
    }>> = [];
    currentPairs: Array<{
        attack: Card,
        defend: Card | null
    }>;
    isFinished: boolean;

    _onGameState: Array<()=>void> = [];

    constructor(){
      this.players = [];
      this.isFinished = false;
    }

    onGameState(){
        this._onGameState.forEach(it=> it());
    }

    start(){
        this.isFinished = false;
        log('start');
        this.currentPlayerIndex = 0;
        this.deck = mixDeck(createDeck());
        log(JSON.stringify(this.deck))
        this.trump = this.deck[0].type;
        console.log('trump ', this.trump)
        this.currentPairs = [];
        this.moveCards();
        this.onGameState();
    }

    addPlayer(){
        const player = new Player(this, this.players.length);
        this.players.push(player);
        this.onGameState?.();
        return player
    }

    attack(player: Player, card: Card){
        if (player.index != this.currentPlayerIndex){
            log('Wrong player attack')
            return false;
        }
        log('attack ' + card.value + card.type);
        const allCards: Array<Card> = [];
        this.currentPairs.forEach(it=>{
            allCards.push(it.attack);
            if (it.defend){
                allCards.push(it.defend);
            }
        })
        if (!allCards.length || canAdd(card, allCards)){
            this.currentPairs.push({
                attack: card,
                defend: null
            })
            this.onGameState();
            return true;
        }
        return false;
    }

    defend(player: Player, defendCard: Card, attackCard: Card){
        const defenderIndex = this.getDefender();
        if (player.index != defenderIndex){
            log('Wrong player defend')
            return false;
        }
        log('defend ' + defendCard.value + defendCard.type);
        if (isBeats(defendCard, attackCard, this.trump)){
            const pair = this.currentPairs.find(it=> sameCard(it.attack, attackCard));
            if (pair){
                pair.defend = defendCard;
                this.onGameState();
            } else {
                throw new Error('Card not found.');
            }
        }
    }

    fold(player: Player){
        const defenderIndex = this.getDefender();
        if (player.index != defenderIndex){
            log('Wrong player fold')
            return false;
        }

        log('fold');
        const defender = this.players[defenderIndex];
        this.currentPairs.forEach(it=>{
            defender.cards.push(it.attack);
            if (it.defend){
                defender.cards.push(it.defend);
            }
        });
        this.currentPairs = [];
        this.moveCards();
        if (this.players.filter(it=>!it.isWin).length == 1){
            log('fold win');
            this.isFinished = true;
            return;
        }
        if (this.players.filter(it=>!it.isWin).length == 0){
            log('unknown win');
            this.isFinished = true;
            return;
        }
        this.currentPlayerIndex = defenderIndex;
        this.nextPlayer();
        this.onGameState();
    }

    turn(player: Player){
        if (player.index != this.currentPlayerIndex){
            log('Wrong player turn')
            return false;
        }
        if (this.currentPairs.find(pair => !pair.defend) != null){
            return false;
        }
        log('turn');
        //this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        //this.history.push()
        this.history.push(this.currentPairs);
        this.currentPairs = [];
        this.moveCards();
        
        if (this.players.filter(it=>!it.isWin).length == 1){
            //emit winners
            //this.onGameState();
            log('win');
            this.isFinished = true;
        } else {
            this.nextPlayer();
            this.onGameState();
        }
        return true;
    }

    moveCards(){
        const sequence = rotateSequence(getSequence(this.players.length), this.currentPlayerIndex);
        sequence.forEach(it=>{
            while (this.players[it].cards.length < 6){
                const topCard = this.deck.pop();
                if (!topCard){
                    break;
                }
                this.players[it].cards.push(topCard);
            }
        });
        this.players.forEach((it)=>{
            if (it.cards.length == 0){
                it.isWin = true;
            }
        });
    }

    nextPlayer(){
       do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        } while (this.players[this.currentPlayerIndex].isWin != false); 
    }

    getDefender(){
        let initialDefender = (this.currentPlayerIndex + 1) % this.players.length;
        while (this.players[initialDefender].isWin != false){
            initialDefender = (initialDefender + 1) % this.players.length;
        }
        if (initialDefender == this.currentPlayerIndex){
            throw new Error('Wrong player defender.')
        }
        return initialDefender;
    }
}
