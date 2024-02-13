import { words } from "./wordlist";

export class WordTools{
    list: Array<string>;
    constructor(){
        this.list = words.split('\n').filter(it=>it.length > 1).map(it=>it.toLowerCase().trim());
    }
}
