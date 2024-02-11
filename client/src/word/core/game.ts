import { FieldLetter } from "./fieldLetter";
import { Player } from "./player";

const testLetters = [
    {
        x: -10,
        y: -10,
        value: 1,
        text: 'a'
    },
    {
        x: 10,
        y: 10,
        value: 2,
        text: 'b'
    },
    {
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
    bank: Array<string> = [];
    constructor(){

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
    
    destroy(){

    }
}