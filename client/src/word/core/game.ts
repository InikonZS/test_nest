import { FieldLetter } from "./fieldLetter";
import { Player } from "./player";
import { Bank } from "./bank";
import { BankLetter } from "./bankLetter";
import { WordTools} from "./wordTools";

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
    wordTools: WordTools;
    constructor(){
        this.bank = new Bank();
        this.wordTools = new WordTools();
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

    checkWord(word: string){
        console.log(word);
        return this.wordTools.list.find(it=> it==word) != undefined;
    }

    checkInput(inputLetters: Array<FieldLetter>){
        if (!inputLetters.length){
            return;
        }
        let verticalCorrect = true;
        let horizontalCorrect = true;
        for (let i=1; i< inputLetters.length; i++){
            const prevLetter = inputLetters[i - 1];
            const letter = inputLetters[i];
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
            //do not return cause of horizontal and vertical both test
            const wordLetters = this.getHorizontalWord(inputLetters);
            const includesAllInput = inputLetters.find(letter => !wordLetters.includes(letter)) == undefined;
            if (!includesAllInput){
                console.log('not all input');
                return;
            }

            const checkWordResult = this.checkWord(wordLetters.map(it=>it.text).join(''));
            if (!checkWordResult){
                console.log('rejected main word', checkWordResult);
                return;
            }
            
            const vericalWords = wordLetters.map(it=>this.getVerticalWord([it])).filter(it=>it.length > 1);
            const checkVerticalResult = vericalWords.find(word=> this.checkWord(word.map(it=>it.text).join('')) == false);// == undefined;
            console.log('ch res', wordLetters, vericalWords, checkVerticalResult);
            if (vericalWords.length && checkVerticalResult){
                return;
            }
            
            const isInitial = inputLetters.find(it=> it.x == 0 && it.y == 0);
            if (!isInitial && (!vericalWords.length && wordLetters.length == inputLetters.length)){
                return;
            }
            return true;
            //const startInput = this.inputLetters.reduce((min, letter)=>Math.min(letter.x, min), 1000);
        }

        if (verticalCorrect){
            const wordLetters = this.getVerticalWord(inputLetters);
            const includesAllInput = inputLetters.find(letter => !wordLetters.includes(letter)) == undefined;
            if (!includesAllInput){
                console.log('not all input');
                return;
            }

            const checkWordResult = this.checkWord(wordLetters.map(it=>it.text).join(''));
            if (!checkWordResult){
                console.log('rejected main word', checkWordResult);
                return;
            }
            const horizontalWords = wordLetters.map(it=>this.getHorizontalWord([it])).filter(it=>it.length > 1);
            
            const checkHorizontalResult = horizontalWords.find(word=> this.checkWord(word.map(it=>it.text).join('')) == false);// == undefined;
            console.log('ch res h', wordLetters, horizontalWords, checkHorizontalResult);
            if (horizontalWords.length && checkHorizontalResult){
                return;
            }
            
            const isInitial = inputLetters.find(it=> it.x == 0 && it.y == 0);
            if (!isInitial && (!horizontalWords.length && wordLetters.length == inputLetters.length)){
                return;
            }
            return true;
            //const startInput = this.inputLetters.reduce((min, letter)=>Math.min(letter.x, min), 1000);
        }
    }

    scanField(){
        const bounds = this.getLettersBounds();
        for (let y=bounds.top; y<= bounds.bottom; y++){
            console.log('scan line', y);
            const matchedResults = this.scanLine(y, 7, false);
            if (matchedResults.length){
                this.botSubmit(matchedResults[0]);
                return;
            }
        }
        for (let x=bounds.left; x<= bounds.right; x++){
            console.log('scan line', x);
            const matchedResults = this.scanLine(x, 7, true);
            if (matchedResults.length){
                this.botSubmit(matchedResults[0]);
                return;
            }
        }
    }

    botSubmit(inputSlots: Array<FieldLetter>){
        inputSlots.forEach(slot=>{
           this.inputLetters.push(slot);
           const hand = this.players[0].letters;
           hand.splice(hand.findIndex(it=> it.id == slot.id), 1);
        });
        
        this.inputLetters.forEach(letter=>{
            this.letters.push(letter);
        });
        this.inputLetters = [];

        this.addLetters();
    }

    scanLine(row: number, handLettersLength: number, vertical: boolean){
        const ay = vertical ? 'x' : 'y';
        const ax = vertical ? 'y' : 'x';
        const fieldRow = this.letters.filter(it=>it[ay] == row).sort((a, b)=>a[ax] - b[ax]);
        const indexed: Record<number, FieldLetter> = {};
        fieldRow.forEach(it=>{
            indexed[it[ax]] = it;
        });
        let preparedResults: Array<Array<FieldLetter>> = [];
        fieldRow.forEach(initialLetter=>{
            for (let i = handLettersLength; i>0; i--){
                for (let offsets = 0; offsets<=i; offsets++){
                    let rightLetters = i - offsets;
                    let rightPos = initialLetter[ax];
                    let leftLetters = offsets;
                    let leftPos = initialLetter[ax] + (offsets == i ? 0 : -1);
                    const candidateSlots: Array<FieldLetter> = [];
                    while(rightLetters>0){
                        while (indexed[rightPos]){
                            candidateSlots.push(indexed[rightPos]);
                            rightPos++;
                        }
                        candidateSlots.push({x:null, y:null, id: null, text: null, value: null, [ax]: rightPos, [ay]: row}); //null for hand letter
                        rightPos++;
                        rightLetters--;
                    }
                    while (indexed[rightPos]){
                        candidateSlots.push(indexed[rightPos]);
                        rightPos++;
                    }

                    while(leftLetters>0){
                        while (indexed[leftPos]){
                            candidateSlots.unshift(indexed[leftPos]);
                            leftPos--;
                        }
                        candidateSlots.unshift({x:null, y:null, id: null, text: null, value: null, [ax]: leftPos, [ay]: row}); //null for hand letter
                        leftPos--;
                        leftLetters--;
                    }
                    while (indexed[leftPos]){
                        candidateSlots.unshift(indexed[leftPos]);
                        leftPos--;
                    }
                    console.log(candidateSlots);
                    const matchedWords = this.anagramChecker(candidateSlots.map(slot=> slot.text), this.players[0].letters);
                    console.log('matched', matchedWords);

                    // generate only inputed letters
                    const getPreparedInput = (word: string)=>{
                        return candidateSlots.map((slot, index)=>{
                            if (slot.text) return null;
                            const playerHand = [...this.players[0].letters];
                            console.log(playerHand, word);
                            const foundPlayerLetterIndex = playerHand.findIndex(playerLetter=>{
                                return playerLetter.text == word[index];
                            });
                            const foundPlayerLetter = playerHand[foundPlayerLetterIndex];
                            console.log(foundPlayerLetter);
                            playerHand.splice(foundPlayerLetterIndex, 1);
                            const preparedInputSlot = {
                                ...slot,
                                text: foundPlayerLetter.text,
                                id: foundPlayerLetter.id
                            }
                            return preparedInputSlot
                        }).filter(it=>it);
                    }
                    const foundPrepared = matchedWords.map(matched =>{
                        const prepared = getPreparedInput(matched);
                        console.log('prepared', prepared);
                        if (this.checkInput(prepared)){
                            console.log('checked ', prepared)
                            return prepared;
                        }
                        return null;
                    }).filter(it=>it);
                    if (foundPrepared.length){
                        preparedResults = [...preparedResults, ...foundPrepared]
                    }
                }
            }
        });

        console.log('full matched list', preparedResults);
        return preparedResults;
    }

    anagramChecker(candidate: Array<string>, handLetters: Array<BankLetter>){
        const availableWords = this.wordTools.list.filter(word=>{
            if (word.length != candidate.length){
                return false;
            };
            const wrongLetterIndex = candidate.findIndex((candidateLetter, letterIndex)=>{
                return candidateLetter && word[letterIndex] != candidateLetter;
            });
            return wrongLetterIndex == -1;
        });

        const matchedWithHand = availableWords.filter(word=>{
            const handRemains = handLetters.map(it=> it.text);
            const wrongLetterIndex = candidate.findIndex((candidateLetter, letterIndex)=>{
                if (!candidateLetter){
                    const foundHandLetterIndex = handRemains.findIndex(it=>it == word[letterIndex]);
                    if (foundHandLetterIndex != -1){
                        handRemains.splice(foundHandLetterIndex, 1);
                        return false
                    } else {
                        return true;
                    }
                }
                return false;
            });
            return wrongLetterIndex == -1;
        });
        return matchedWithHand;
        
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
        if (!this.checkInput(this.inputLetters)){
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