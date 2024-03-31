import { IVector } from './IVector';

export const collectables = {
    egg0: {
        type: 'egg0',
        price: 10,
        size: 1
    },
    egg1: {
        type: 'egg1',
        price: 30,
        size: 2
    },
    egg2: {
        type: 'egg2',
        price: 100,
        size: 2
    },
    egg3: {
        type: 'egg3',
        price: 250,
        size: 2
    },

    meat0: {
        type: 'meat0',
        price: 100,
        size: 1
    },
    meat1: {
        type: 'meat1',
        price: 300,
        size: 2
    },
    meat2: {
        type: 'meat2',
        price: 1000,
        size: 2
    },

    meat3: {
        type: 'meat2',
        price: 2000,
        size: 2
    },

    milk0: {
        type: 'milk0',
        price: 1000,
        size: 1
    },
    milk1: {
        type: 'milk1',
        price: 3000,
        size: 2
    },
    milk2: {
        type: 'milk2',
        price: 4000,
        size: 2
    },

    milk3: {
        type: 'milk2',
        price: 5000,
        size: 2
    },

    meal: {
        type: 'meal',
        price: 10,
        size: 1
    },
    pack: {
        type: 'pack',
        price: 30,
        size: 2
    },
    bottle: {
        type: 'bottle',
        price: 100,
        size: 2
    },
}

export class Collectable{
    position: IVector;
    type: keyof typeof collectables;
    price: number;
    size: number;
    time: number = 10;
    get isTimeout(){
        return this.time<3;
    };
    id: number;

    static lastId = 0;

    constructor(type: keyof typeof collectables, position?: IVector){
        this.position = {...position} || {x:0, y:0}
        this.type = type;
        const config  = collectables[type];
        this.price = config.price;
        this.size = config.size;

        Collectable.lastId +=1;
        this.id = Collectable.lastId;
    }
}