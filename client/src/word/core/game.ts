import { FieldLetter } from "./fieldLetter";
import { Player } from "./player";
import { Bank } from "./bank";
import { BankLetter } from "./bankLetter";
import { WordTools} from "./wordTools";

function binarySearch(items: Array<string | number>, value: string | number): number{

    var startIndex  = 0,
        stopIndex   = items.length - 1,
        middle      = Math.floor((stopIndex + startIndex)/2);

    while(items[middle] != value && startIndex < stopIndex){

        //adjust search area
        if (value < items[middle]){
            stopIndex = middle - 1;
        } else if (value > items[middle]){
            startIndex = middle + 1;
        }

        //recalculate middle
        middle = Math.floor((stopIndex + startIndex)/2);
    }

    //make sure it's the right value
    return (items[middle] != value) ? -1 : middle;
}

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
        //console.log(word);
        return binarySearch(this.wordTools.listsByLength[word.length] || [], word) != -1;//this.wordTools.list.find(it=> it==word) != undefined;
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

        const checkHorizontal = ()=>{
            const wordLetters = this.getHorizontalWord(inputLetters);
            const includesAllInput = inputLetters.find(letter => !wordLetters.includes(letter)) == undefined;
            if (!includesAllInput){
                console.log('not all input');
                return false;
            }

            const checkWordResult = this.checkWord(wordLetters.map(it=>it.text).join(''));
            if (!checkWordResult){
                console.log('rejected main word', checkWordResult);
                return false;
            }
            
            const vericalWords = wordLetters.map(it=>this.getVerticalWord([it])).filter(it=>it.length > 1);
            const checkVerticalResult = vericalWords.find(word=> this.checkWord(word.map(it=>it.text).join('')) == false);// == undefined;
            //console.log('ch res', wordLetters, vericalWords, checkVerticalResult);
            if (vericalWords.length && checkVerticalResult){
                return false;
            }
            
            const isInitial = inputLetters.find(it=> it.x == 0 && it.y == 0);
            if (!isInitial && (!vericalWords.length && wordLetters.length == inputLetters.length)){
                return false;
            }
            return true;
        }

        const checkVertical = ()=>{
            const wordLetters = this.getVerticalWord(inputLetters);
            const includesAllInput = inputLetters.find(letter => !wordLetters.includes(letter)) == undefined;
            if (!includesAllInput){
                console.log('not all input');
                return false;
            }

            const checkWordResult = this.checkWord(wordLetters.map(it=>it.text).join(''));
            if (!checkWordResult){
                console.log('rejected main word', checkWordResult);
                return false;
            }
            const horizontalWords = wordLetters.map(it=>this.getHorizontalWord([it])).filter(it=>it.length > 1);
            
            const checkHorizontalResult = horizontalWords.find(word=> this.checkWord(word.map(it=>it.text).join('')) == false);// == undefined;
            //console.log('ch res h', wordLetters, horizontalWords, checkHorizontalResult);
            if (horizontalWords.length && checkHorizontalResult){
                return false;
            }
            
            const isInitial = inputLetters.find(it=> it.x == 0 && it.y == 0);
            if (!isInitial && (!horizontalWords.length && wordLetters.length == inputLetters.length)){
                return false;
            }
            return true;
        }
        
        if (horizontalCorrect){
            horizontalCorrect = checkHorizontal();
        }

        if (verticalCorrect){
            verticalCorrect = checkVertical();
        }

        return horizontalCorrect || verticalCorrect;
    }

    finishBotTest(){
        while(this.scanField()){
            console.log('bot move');
        }
        console.log('game over');
    }

    scanField(){
        let matchedResults: Array<FieldLetter[]> = [];
        const bounds = this.getLettersBounds();
        for (let y=bounds.top; y<= bounds.bottom; y++){
            //console.log('scan line', y);
            const matchedResultsV = this.scanLine(y, 7, false);
            matchedResults = matchedResults.concat(matchedResultsV);
            
        }
        for (let x=bounds.left; x<= bounds.right; x++){
            //console.log('scan line', x);
            const matchedResultsH = this.scanLine(x, 7, true);
            matchedResults = matchedResults.concat(matchedResultsH);
        }
        if (matchedResults.length){
            matchedResults.sort((a, b)=> b.length - a.length);
            this.botSubmit(matchedResults[0]);
            return true;
        } else {
            console.log('no matched any result')
            return false;
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
        if (!fieldRow.length) return [];

        //optimization with only separated letters check
        const separatedLetters: Array<FieldLetter> = [];
        let lastLetter = fieldRow[0];
        for (let i = 1; i< fieldRow.length; i++){
            if (lastLetter[ax] == fieldRow[i][ax] - 1){} else {
                separatedLetters.push(lastLetter);
            }
            lastLetter = fieldRow[i];
        }
        separatedLetters.push(lastLetter);
        //console.log(separatedLetters, fieldRow);

        const indexed: Record<number, FieldLetter> = {};
        fieldRow.forEach(it=>{
            indexed[it[ax]] = it;
        });
        let preparedResults: Array<Array<FieldLetter>> = [];
        /*fieldRow*/separatedLetters.forEach(initialLetter=>{
            for (let i = handLettersLength; i>=0; i--){
                for (let offsets = 0; offsets<=i; offsets++){
                    let rightLetters = i - offsets;
                    let rightPos = initialLetter[ax];
                    let leftLetters = offsets;
                    let leftPos = initialLetter[ax] -1/*+ (offsets == i ? 0 : -1)*/;
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

                    candidateSlots.reverse(); //double reverse instead of unshift
                    while(leftLetters>0){
                        while (indexed[leftPos]){
                            candidateSlots.push(indexed[leftPos]);
                            leftPos--;
                        }
                        candidateSlots.push({x:null, y:null, id: null, text: null, value: null, [ax]: leftPos, [ay]: row}); //null for hand letter
                        leftPos--;
                        leftLetters--;
                    }
                    while (indexed[leftPos]){
                        candidateSlots.push(indexed[leftPos]);
                        leftPos--;
                    }
                    candidateSlots.reverse();
                    //console.log(candidateSlots);
                    const matchedWords = this.anagramChecker(candidateSlots.map(slot=> slot.text), this.players[0].letters);
                    //console.log('matched', matchedWords);
                    if (!matchedWords.length){
                        continue;
                    }
                    // generate only inputed letters
                    const getPreparedInput = (word: string)=>{
                        return candidateSlots.map((slot, index)=>{
                            if (slot.text) return null;
                            const playerHand = [...this.players[0].letters];
                            //console.log(playerHand, word);
                            const foundPlayerLetterIndex = playerHand.findIndex(playerLetter=>{
                                return playerLetter.text == word[index];
                            });
                            const foundPlayerLetter = playerHand[foundPlayerLetterIndex];
                            //console.log(foundPlayerLetter);
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
                        //console.log('prepared', prepared);
                        if (this.checkInput(prepared)){
                            //console.log('checked ', prepared)
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

        //console.log('full matched list', preparedResults);
        return preparedResults;
    }

    anagramChecker(candidate: Array<string>, handLetters: Array<BankLetter>){
        const candidateTrueLetters = candidate.map((it, i)=>{
            return {
                text: it,
                index: i
            }
        }).filter(it=> it.text);
        //optimized listByLength
        const availableWords = this.wordTools.listsByLength[candidate.length]?.filter(word=>{
            if (word.length != candidate.length){
                return false;
            };
            const wrongLetterIndex = candidateTrueLetters.findIndex((candidateLetter)=>{
                return word[candidateLetter.index] != candidateLetter.text//candidateLetter && word[letterIndex] != candidateLetter;
            });
            return wrongLetterIndex == -1;
        }) || [];

        const handMap:Record<string, number> = {};
        handLetters.forEach(it=>{
            if (handMap[it.text]) {
                handMap[it.text]++;
            } else {
                handMap[it.text] = 1;
            }
        });

        const matchedWithHand = availableWords.filter(word=>{
            const handRemains = {...handMap};
            const wrongLetterIndex = candidate.findIndex((candidateLetter, letterIndex)=>{
                if (!candidateLetter){
                    const foundHandLetterCount = handRemains[word[letterIndex]];
                    if (foundHandLetterCount){
                        handRemains[word[letterIndex]]--;
                        return false
                    } else {
                        return true;
                    }
                }
                return false;
            });
            return wrongLetterIndex == -1;
        });
        /*
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
        });*/
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