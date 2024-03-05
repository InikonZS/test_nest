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
        price: 10000,
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
    type: string;
    price = 100;
    size = 1;

    constructor(type: string, position: IVector){
        this.position = {...position}
        this.type = type;
    }
}