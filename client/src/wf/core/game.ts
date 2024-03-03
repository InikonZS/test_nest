import { Animal } from './animal';
import { Collectable } from './collectable';
import { Car } from './car';
import { Water } from './water';
import { Grass } from './grass';
import { Storage } from './storage';
import { Factory, FactoryEgg0, FactoryEgg1 } from './factory';

export class Game{
    animals: Array<Animal> = [];
    items: Array<Collectable> = [];
    storage: Storage = new Storage();
    factories: Array<Factory> = [];
    money: number = 0;
    water: Water;
    car: Car;
    onChange: ()=>void;
    constructor(){
        this.addAnimal(0);
        const factory = new FactoryEgg0(this);
        factory.onFinish=()=>{this.onChange()}
        const factory1 = new FactoryEgg1(this);
        factory1.onFinish=()=>{this.onChange()}
        this.factories.push(factory, factory1);
        this.car = new Car(this);
        this.water = new Water(this);
    }

    addAnimal(index: number){
        const animal = new Animal();
        animal.onPositionChange = ()=>{
            this.onChange();
        }
        animal.onObjectEmit = ()=>{
            this.items.push(new Collectable('egg0', animal.lastPosition));
            this.onChange();
        }
        this.animals.push(animal);
        this.onChange?.();
    }
    collect(item: Collectable){
        this.items.splice(this.items.findIndex(it=>it==item), 1);
        this.storage.items.push(item);
        this.onChange();
    }

    startFactory(factory: Factory){
        factory.startFactory();
        this.onChange();
    }
}