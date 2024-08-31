import { FieldLetter } from "./fieldLetter";
import { Player } from "./player";
import { Bank } from "./bank";
import { BankLetter } from "./bankLetter";
import { WordTools} from "./wordTools";
import { IGameOptions } from "./interfaces";

export enum Boosters {
    doubleLetter = '3',
    tripleLetter = '1',
    doubleWord = '2',
    tripleWord = '4',
    none = ''
}

export type IBoostedWord = {
    word: {
        letter: FieldLetter;
        booster: string;
    }[];
    wordBoosters: string[];
}

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
    players: Array<Player> = [];
    letters: Array<FieldLetter> = [/*...testLetters*/];
    currentPlayerIndex: number = 0;
    inputLetters: Array<FieldLetter> = [];
    bank: Bank;
    wordTools: WordTools;
    onWordSubmitted: (score: {
        words: IBoostedWord[]
        score: number;
    })=>void;
    onFinish: ()=>void;

    pattern = [
        '-1----3----1',
        '---2-----2--',
        '--3--3-3--3-',
        '3---2---2---',
        '---3-1-1-3--',
        '23----4----3',
        '---3-1-1-3--',
        '3---2---2---',
        '--3--3-3--3-',
        '---2-----2--',
        '-1----3----1',
        '--2---2---2-',
    ];

    constructor(options: IGameOptions){
        this.bank = new Bank(options.letters);
        this.wordTools = new WordTools();
        this.players = new Array(options.players).fill(null).map(() =>new Player());
        this.addLetters();
    }

    addLetters(){
        const playerLetterLimit = 7;
        if (!this.bank.letters.length){
            const player = this.currentPlayer;
            if (this.currentPlayer.isLastMove){
                this.currentPlayer.isFinished = true;
            }
            if (player.letters.length< playerLetterLimit && player.isLastMove == false && player.isFinished == false){
                player.isLastMove = true;
            }
            if (player.letters.length == 0){
                player.isFinished = true;
            }
            return;
        }
        this.players.forEach(player=>{
            let breaker = 0;
            while (player.letters.length < playerLetterLimit && this.bank.letters.length && breaker < 1000) {
                breaker++;
                player.letters.push(this.bank.letters.pop());   
            }
            if (player.letters.length< playerLetterLimit && player.isLastMove == false && player.isFinished == false){
                player.isLastMove = true;
            }
        });
        console.log(this.players);
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

    getWordScore(word:Array<FieldLetter>, sideWords: Array<Array<FieldLetter>>){
        const getBoosteredWord = (_word: Array<FieldLetter>)=>{
            const wordBoosters: Array<string> = [];
            const boostedLetters: Array<{letter: FieldLetter, booster: string}> = [];
            _word.forEach(letter=>{
                const booster = this.getBoosterAt(letter.x, letter.y);
                if (booster == Boosters.doubleWord || booster == Boosters.tripleWord){
                    wordBoosters.push(booster);
                }
                if (booster == Boosters.doubleLetter || booster == Boosters.tripleLetter){
                    boostedLetters.push({letter: letter, booster: booster});
                } else {
                    boostedLetters.push({letter: letter, booster: Boosters.none});
                }
            })
            return {word: boostedLetters, wordBoosters}
        }
        //let score = word.reduce((ac, it) => ac + it.value, 0);

        const boostedWords: Array<IBoostedWord> = [getBoosteredWord(word)];
        //if (sideWords.length){ console.log('side', sideWords);}
        sideWords.forEach(it=>{
            const containsLetter = it.find(jt=> this.inputLetters.includes(jt));
            if (containsLetter){
                //score += it.reduce((ac, it) => ac + it.value, 0);
                boostedWords.push(getBoosteredWord(it));
            }
        });
        //now score duplicate if letter related to both word
        //result.score = score;
        const getWordScore = (_boosted: IBoostedWord)=>{
            let wordScore = _boosted.word.reduce((ac, it) => {
                let letterScore = it.letter.value;
                if (it.booster == Boosters.doubleLetter){
                    letterScore *= 2;
                } else if (it.booster == Boosters.tripleLetter){
                    letterScore *= 3;
                }
                return ac + letterScore;
            }, 0);
            _boosted.wordBoosters.forEach(booster=>{
                if (booster == Boosters.doubleWord){
                    wordScore *= 2;
                } else if (booster == Boosters.tripleWord){
                    wordScore *= 3;
                }
            });
            return wordScore;
        }
        const score = boostedWords.reduce((ac, it)=> ac + getWordScore(it), 0);
        return {words: boostedWords, score: score};
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
                return null;
            }

            const checkWordResult = this.checkWord(wordLetters.map(it=>it.text).join(''));
            if (!checkWordResult){
                console.log('rejected main word', checkWordResult);
                return null;
            }
            
            const vericalWords = wordLetters.map(it=>this.getVerticalWord([it])).filter(it=>it.length > 1);
            const checkVerticalResult = vericalWords.find(word=> this.checkWord(word.map(it=>it.text).join('')) == false);// == undefined;
            //console.log('ch res', wordLetters, vericalWords, checkVerticalResult);
            if (vericalWords.length && checkVerticalResult){
                return null;
            }
            
            const isInitial = inputLetters.find(it=> it.x == 0 && it.y == 0);
            if (!isInitial && (!vericalWords.length && wordLetters.length == inputLetters.length)){
                return null;
            }

            //console.log(this.getWordScore(wordLetters, vericalWords));
            return this.getWordScore(wordLetters, vericalWords);
        }

        const checkVertical = ()=>{
            const wordLetters = this.getVerticalWord(inputLetters);
            const includesAllInput = inputLetters.find(letter => !wordLetters.includes(letter)) == undefined;
            if (!includesAllInput){
                console.log('not all input');
                return null;
            }

            const checkWordResult = this.checkWord(wordLetters.map(it=>it.text).join(''));
            if (!checkWordResult){
                console.log('rejected main word', checkWordResult);
                return null;
            }
            const horizontalWords = wordLetters.map(it=>this.getHorizontalWord([it])).filter(it=>it.length > 1);
            
            const checkHorizontalResult = horizontalWords.find(word=> this.checkWord(word.map(it=>it.text).join('')) == false);// == undefined;
            //console.log('ch res h', wordLetters, horizontalWords, checkHorizontalResult);
            if (horizontalWords.length && checkHorizontalResult){
                return null;
            }
            
            const isInitial = inputLetters.find(it=> it.x == 0 && it.y == 0);
            if (!isInitial && (!horizontalWords.length && wordLetters.length == inputLetters.length)){
                return null;
            }
            //console.log(this.getWordScore(wordLetters, horizontalWords));
            return this.getWordScore(wordLetters, horizontalWords);
        }

        let scoreResult = null
        
        if (horizontalCorrect){
            const horizontalScore = checkHorizontal();
            horizontalCorrect = horizontalScore != null;
            scoreResult = horizontalScore;
        }

        if (verticalCorrect){
            const verticalScore = checkVertical()
            verticalCorrect = verticalScore != null;
            scoreResult = verticalScore;
        }

        return scoreResult;
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

    get currentPlayer(){
        return this.players[this.currentPlayerIndex];
    }

    botSubmit(inputSlots: Array<FieldLetter>){
        
        inputSlots.forEach(slot=>{
           this.inputLetters.push(slot);
           const hand = this.currentPlayer.letters;
           hand.splice(hand.findIndex(it=> it.id == slot.id), 1);
        });
        
        const wordScore = this.checkInput(this.inputLetters);  
        if (!wordScore){
            console.log('impossible case, incorrect bot move');
            return;
        };
        this.players[this.currentPlayerIndex].score +=wordScore.score;
        //this.onWordSubmitted(wordScore);
        
        this.inputLetters.forEach(letter=>{
            this.letters.push(letter);
        });
        this.inputLetters = [];
        this.onWordSubmitted(wordScore);
        this.addLetters();
        this.turnNextPlayer();
    }

    turnNextPlayer(){
        if (!this.players.find(it=>!it.isFinished)){
            this.onFinish();
        }
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        if(this.currentPlayerIndex!=0){
            //bot move;
            this.scanField(); 
        }
    }

    scanLine(row: number, handLettersLength: number, vertical: boolean){
        const ay = vertical ? 'x' : 'y';
        const ax = vertical ? 'y' : 'x';
        const fieldRow = this.letters.filter(it=>it[ay] == row).sort((a, b)=>a[ax] - b[ax]);
        if (!fieldRow.length) {
            if (row == 0){
                fieldRow.push({x:null, y:null, id: null, text: null, value: null, [ax]: 0, [ay]: 0});
            } else {
               return []; 
            }
        }

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
                    const matchedWords = this.anagramChecker(candidateSlots.map(slot=> slot.text), this.currentPlayer.letters);
                    //console.log('matched', matchedWords);
                    if (!matchedWords.length){
                        continue;
                    }
                    // generate only inputed letters
                    const getPreparedInput = (word: string)=>{
                        return candidateSlots.map((slot, index)=>{
                            if (slot.text) return null;
                            const playerHand = [...this.currentPlayer.letters];
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
                                id: foundPlayerLetter.id,
                                value: foundPlayerLetter.value
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

        if (this.letters.length == 0){
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }
        
        return {
            left: minX - 7,
            right: maxX +7,
            top: minY -7,
            bottom: maxY+7,
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

    getBoosterAt(x: number, y: number){
        const periodicY = (y - 5 + 1000) % this.pattern.length;
        const periodicX = (x - 4 + 1000) % this.pattern[0].length;
        return this.pattern[periodicY][periodicX];
    }

    boosterToMap(){
        const bounds = this.getLettersBounds();
        const fieldHeight = bounds.bottom - bounds.top + 1;
        const fielWidth = bounds.right - bounds.left + 1;
        const field: Array<Array<string>>= new Array(fieldHeight).fill(null).map((row, rowIndex)=> new Array(fielWidth).fill('').map((cell, cellIndex)=>{
            const y = rowIndex + bounds.top;
            const x = cellIndex + bounds.left;
            if (x == 0 && y==0){
                return 'start'
            }
            return this.getBoosterAt(x, y);
            /*if (((x - y) % 12 == 0 || (y + x) % 12 == 0) && ((x + 1 )% 6==0 || (y + 1)% 6==0 || (y - 1 )% 6==0)){
                return '2w'
            }

            if (((x - y) % 24 == 0 || (y + x) % 24 == 0) && ((x + 6)% 12==0 || (y + 6)% 12==0)){
                return '3w'
            }

            if (((x - y) % 12 == 0 || (y + x) % 6 == 0) && ((x + 1 )% 6==0 || (y + 1)% 6==0 || (y - 1 )% 3==0)){
                return '2l'
            }*/
            /*if ((x - 2) % 4 ==0 && (y - 2) % 4 ==0){
                return '2w'
            }
            if ((x - 4) % 16 ==0 && (y - 4) % 16 ==0){
                return '3w'
            }
            if (((x - 2) % 8 ==0 || (x + 2) % 8 ==0) && (y - 4) % 8 ==0){
                return '2l'
            }
            if ( (x - 4) % 16 ==0 && ((y - 2) % 16 ==0 || (y + 2) % 16 ==0)){
                return '3l'
            }*/
        }));
        return field;
    }
    
    public submitWord(){    
        const wordScore = this.checkInput(this.inputLetters);  
        if (!wordScore){
            return;
        };
        this.players[this.currentPlayerIndex].score +=wordScore.score;
        this.onWordSubmitted(wordScore);
        this.inputLetters.forEach(letter=>{
            this.letters.push(letter);
        });
        this.inputLetters = [];
        this.addLetters();
        this.turnNextPlayer();
    }

    public resetInput(){
        this.inputLetters.forEach(letter=>{
            this.currentPlayer.letters.push({id: letter.id, text: letter.text, value: letter.value});
        });
        this.inputLetters = [];
    }

    public moveOrRevertLetter(selected: BankLetter, _letterIndex: number){
        const game = this;
        const currentPlayer = this.currentPlayer;
        const playerLetterIndex = currentPlayer.letters.findIndex(it=> it.id == selected.id);
        if (playerLetterIndex != -1){
            const moved = currentPlayer.letters[playerLetterIndex];
            currentPlayer.letters[playerLetterIndex] = null;
            currentPlayer.letters.splice(_letterIndex, 0, {id: moved.id, text: moved.text, value: moved.value});
            currentPlayer.letters = currentPlayer.letters.filter(it=>it);
        } else {
            const letterIndex = game.inputLetters.findIndex(it=> it.id == selected.id);
            game.inputLetters.splice(letterIndex, 1);
            //console.log('up', _letterIndex);
            currentPlayer.letters.splice(_letterIndex, 0, {id: selected.id, text: selected.text, value: selected.value});//.push({id: selected.id, text: selected.text, value: selected.value});
        }    
    }

    public letterToInput(selected: BankLetter, x: number, y: number){
        const bounds = this.getLettersBounds();
        const game = this;
        const playerLetterIndex = this.currentPlayer.letters.findIndex(it=> it.id == selected.id);
        if (playerLetterIndex != -1){
            this.currentPlayer.letters.splice(playerLetterIndex, 1);
        } else {
            const letterIndex = game.inputLetters.findIndex(it=> it.id == selected.id);
            game.inputLetters.splice(letterIndex, 1);
        }                            
        game.inputLetters.push({id: selected.id, text: selected.text, value: selected.value, y: y + bounds.top , x: x + bounds.left});
    }

    destroy(){

    }
}