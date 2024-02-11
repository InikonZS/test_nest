import { FieldLetter } from "./fieldLetter";
import { Player } from "./player";
import { Bank } from "./bank";

const testLetters = [
    {
        id: '-1',
        x: -10,
        y: -10,
        value: 1,
        text: 'a'
    },
    {
        id: '-2',
        x: 10,
        y: 10,
        value: 2,
        text: 'b'
    },
    {
        id: '-3',
        x: 0,
        y: 0,
        value: 3,
        text: 'c'
    }
];

export class Game{
    players: Array<Player> = [new Player()];
    letters: Array<FieldLetter> = [...testLetters];
    currentPlayerIndex: number = 0;
    inputLetters: Array<FieldLetter> = [];
    bank: Bank;
    constructor(){
        this.bank = new Bank();
        this.addLetters();
    }

    addLetters(){
        const playerLetterLimit = 7;
        if (!this.bank.letters.length){
            return;
        }
        this.players.forEach(player=>{
            let breaker = 0;
            while (player.letters.length < playerLetterLimit && this.bank.letters.length && breaker < 1000) {
                breaker++;
                player.letters.push(this.bank.letters.pop());
            }
        });
    }

    checkInput(){

    }

    getLettersBounds(){
        let minX = 1000;
        let maxX = -1000;
        let minY = 1000;
        let maxY = -1000;
        this.letters.forEach(it=>{
            if  (minX > it.x){
                minX = it.x;
            } 
            if  (maxX < it.x){
                maxX = it.x;
            }
            if  (minY > it.y){
                minY = it.y;
            } 
            if  (maxY < it.y){
                maxY = it.y;
            }
        });
        
        return {
            left: minX,
            right: maxX,
            top: minY,
            bottom: maxY,
        }
    }

    lettersToMap(){
        const bounds = this.getLettersBounds();
        console.log(bounds);
        const field: Array<Array<FieldLetter>>= new Array(bounds.bottom - bounds.top + 1).fill(null).map(row=> new Array(bounds.right - bounds.left + 1).fill(null));
        this.letters.forEach(letter=>{
            field[letter.y - bounds.top][letter.x - bounds.left] = letter;
        });
        return {field, bounds};
    }
    
    public submitWord(){
        this.inputLetters.forEach(letter=>{
            this.letters.push(letter);
        });
        this.inputLetters = [];
        this.addLetters();
    }

    destroy(){

    }
}