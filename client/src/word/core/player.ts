import { BankLetter } from "./bankLetter";

export class Player{
    letters: Array<BankLetter> = [];
    score = 0;
    name = 'qwer';
    ava = 'A';
    isLastMove = false;
    isFinished = false;
    constructor(name: string){
        this.name = name;
        this.ava = name.slice(0, 2).toUpperCase();
    }
}