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
        x: -1,
        y: -1,
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

    getHorizontalWord(input: Array<FieldLetter>){
        const fieldRow = this.letters.filter(it=>it.y == input[0].y).concat(input).sort((a, b)=>a.x - b.x);
        const indexed: Record<number, FieldLetter> = {};
        fieldRow.forEach(it=>{
            indexed[it.x] = it;
        })
        const wordLetters: Array<FieldLetter> = [];
        for (let i=input[0].x; i>= fieldRow[0].x; i--){
            const currentLetter = indexed[i];
            if (!currentLetter){
                break;
            }
            wordLetters.push(currentLetter);
        }
        for (let i=input[0].x+1; i<= fieldRow[fieldRow.length-1].x; i++){
            const currentLetter = indexed[i];
            if (!currentLetter){
                break;
            }
            wordLetters.push(currentLetter);
        }
        wordLetters.sort((a, b)=>a.x - b.x);
        return wordLetters;
    }

    getVerticalWord(input: Array<FieldLetter>){
        const fieldRow = this.letters.filter(it=>it.x == input[0].x).concat(input).sort((a, b)=>a.y - b.y);
        const indexed: Record<number, FieldLetter> = {};
        fieldRow.forEach(it=>{
            indexed[it.y] = it;
        })
        const wordLetters: Array<FieldLetter> = [];
        for (let i=input[0].y; i>= fieldRow[0].y; i--){
            const currentLetter = indexed[i];
            if (!currentLetter){
                break;
            }
            wordLetters.push(currentLetter);
        }
        for (let i=input[0].y+1; i<= fieldRow[fieldRow.length-1].y; i++){
            const currentLetter = indexed[i];
            if (!currentLetter){
                break;
            }
            wordLetters.push(currentLetter);
        }
        wordLetters.sort((a, b)=>a.y - b.y);
        return wordLetters;
    }

    checkInput(){
        if (!this.inputLetters.length){
            return;
        }
        let verticalCorrect = true;
        let horizontalCorrect = true;
        for (let i=1; i< this.inputLetters.length; i++){
            const prevLetter = this.inputLetters[i - 1];
            const letter = this.inputLetters[i];
            if (letter.x != prevLetter.x){
                verticalCorrect = false;
            }
            if (letter.y != prevLetter.y){
                horizontalCorrect = false;
            }
        }

        if (!horizontalCorrect && !verticalCorrect){
            console.log('incorrect horizontal and vertical');
            return;
        }
        
        if (horizontalCorrect){
            const wordLetters = this.getHorizontalWord(this.inputLetters);
            const includesAllInput = this.inputLetters.find(letter => !wordLetters.includes(letter)) == undefined;
            if (!includesAllInput){
                console.log('not all input');
                return;
            }
            
            const vericalWords = wordLetters.map(it=>this.getVerticalWord([it])).filter(it=>it.length > 1);
            console.log(wordLetters, vericalWords);
            const isInitial = this.inputLetters.find(it=> it.x == 0 && it.y == 0);
            if (!isInitial && (!vericalWords.length && wordLetters.length == this.inputLetters.length)){
                return;
            }
            return true;
            //const startInput = this.inputLetters.reduce((min, letter)=>Math.min(letter.x, min), 1000);
        }

        if (verticalCorrect){
            const wordLetters = this.getVerticalWord(this.inputLetters);
            const includesAllInput = this.inputLetters.find(letter => !wordLetters.includes(letter)) == undefined;
            if (!includesAllInput){
                console.log('not all input');
                return;
            }
            const horizontalWords = wordLetters.map(it=>this.getHorizontalWord([it])).filter(it=>it.length > 1);;
            console.log(wordLetters, horizontalWords);
            const isInitial = this.inputLetters.find(it=> it.x == 0 && it.y == 0);
            if (!isInitial && (!horizontalWords.length && wordLetters.length == this.inputLetters.length)){
                return;
            }
            return true;
            //const startInput = this.inputLetters.reduce((min, letter)=>Math.min(letter.x, min), 1000);
        }
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
        //console.log(bounds);
        const field: Array<Array<FieldLetter>>= new Array(bounds.bottom - bounds.top + 1).fill(null).map(row=> new Array(bounds.right - bounds.left + 1).fill(null));
        this.letters.forEach(letter=>{
            field[letter.y - bounds.top][letter.x - bounds.left] = letter;
        });
        return {field, bounds};
    }
    
    public submitWord(){        
        if (!this.checkInput()){
            return;
        };
        this.inputLetters.forEach(letter=>{
            this.letters.push(letter);
        });
        this.inputLetters = [];

        this.addLetters();
    }

    destroy(){

    }
}