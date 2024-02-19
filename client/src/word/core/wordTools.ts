import { words } from "./wordListLong";

export class WordTools{
    list: Array<string>;
    listsByLength: Array<string[]>;
    constructor(){
        this.list = words.split('\n').filter(it=>it.length > 1).map(it=>it.toLowerCase().trim()).sort();

        this.listsByLength = [];
        this.list.forEach(word=>{
            if (this.listsByLength[word.length]){
                this.listsByLength[word.length].push(word);
            } else {
                this.listsByLength[word.length] = [word];
            }
        });
    }
}
