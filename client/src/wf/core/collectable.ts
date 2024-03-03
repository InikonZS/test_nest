import { IVector } from './IVector';

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