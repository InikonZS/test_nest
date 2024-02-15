import { BankLetter } from "./bankLetter";

export const abc = 'abcdefghijklmnopqrstuvwxyz';
export const frequency = [
    7.8,
    2,
    4,
    3.8,
    11,
    1.4,
    3,
    2.3,
    8.6,
    0.21,
    0.97,
    5.3,
    2.7,
    7.2,
    6.1,
    2.8,
    0.19,
    7.3,
    8.7,
    6.7,
    3.3,
    1,
    0.91,
    0.27,
    1.6,
    0.44
];

function bankFromFrequency(targetCount: number, abc: string, frequency: Array<number>){
    const sumFreq = frequency.reduce((ac, it)=>ac + it, 0);
    const counts = frequency.map(it=>{
        const count = (it / sumFreq) * targetCount;
        return Math.ceil(count);
    });

    let sumCounts = counts.reduce((ac, it)=>ac + it, 0);

    const sortedCounts = counts.map((it, i)=> ({count: it, index: i})).sort((a, b)=> b.count - a.count);

    for (let i=0; i < targetCount; i++){
        if (targetCount == sumCounts) break;
        const current = sortedCounts[i];
        counts[current.index] -= 1;
        sumCounts -=1;
    }

    const bank = counts.map((it, i)=>{
        return {
            text: abc[i],
            count: it
        }
    })
    return bank;
}

export function mixArray<T>(_items: Array<T>): Array<T> {
    const arr = [];
    const items = [..._items];
    while (items.length) {
      const randomIndex = Math.floor(Math.random() * items.length);
      const el = items[randomIndex];
      items[randomIndex] = items[items.length - 1];
      arr.push(el);
      items.pop()
    }
  
    return arr;
  }

export class Bank{
    letters: Array<BankLetter> = [];

    constructor(){
        const bank = bankFromFrequency(200, abc, frequency);
        bank.forEach(it=>{
            for (let i=0; i< it.count; i++){
                this.letters.push({
                    id: this.letters.length.toString(),
                    text: it.text,
                    value: (it.count > 10 ? 1 : 4)
                })
            }
        });
        this.letters = mixArray(this.letters);
    }

    getLetterCounts(){
        const result: Record<string, number> = {};
        this.letters.forEach((letter)=>{
            if (result[letter.text]){
                result[letter.text] += 1;
            } else {
                result[letter.text] = 1;
            }
        });
        return result;
    }
}