import {IVector} from '../common/IVector';

export class GameObject{
    position: IVector;
    zIndex: number;
    id: number;
    removed: boolean = false;
    moving: boolean = false;
    activated: boolean = false;
    actionType: string = '';
    background: boolean = false;
    health?: number;
    

    static lastId: number = 0;

    static getNextId(){
      GameObject.lastId++;
      return GameObject.lastId;
    }

    constructor(position: IVector){
        this.position = position;
        this.id = GameObject.getNextId();
    }

    move(directed: GameObject): boolean{
        return false
    }

    reverseMove(origin: GameObject): boolean{
        return false;
    }

    fall():boolean{
        return false;
    }

    damage(type: string = ''){

    }
    
    execute (objects: Array<GameObject>){

    }
}