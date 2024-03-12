import { Animal, animals } from './animal';
import { Collectable } from './collectable';
import { Car } from './car';
import { Water } from './water';
import { Grass } from './grass';
import { Storage } from './storage';
import { Plane } from './plane';
import { Factory, factories} from './factory';
import { IVector } from './IVector';

const defaultFactoriesSlots = [
    ['f_egg0', 'f_milk0'],
    ['f_egg1', 'f_milk1'],
    ['f_egg2', 'f_milk2'],
    ['f_meat0', 'f_milk0'],
    ['f_meat1', 'f_milk1'],
    ['f_meat2', 'f_milk2']
];

export class Game{
    animals: Array<Animal> = [];
    items: Array<Collectable> = [];
    grass: Array<Grass> = [];
    storage: Storage = new Storage();
    factories: Array<Factory> = new Array(6).fill(null);
    factoriesSlots: Array<Array<keyof typeof factories>> = defaultFactoriesSlots;
    flyingItems: Array<{type: string, pathType: string, startPos: IVector}> = [];
    _money: number = 1000;
    get money(){
        return this._money
    }
    set money(value){
        this._money = value;
        const mission = this.missionTasks.find(it=>it.type == 'money');
        if (mission){
            mission.current=value;
        }
        if (mission.current>=mission.count){
            mission.isCompleted = true;
        }

    }
    water: Water;
    car: Car;
    plane: Plane;
    availableAnimals = animals;
    missionTasks = [
        {
            type: 'egg0',
            count: 5,
            current: 0,
            isCompleted: false
        },
        {
            type: 'egg1',
            count: 2,
            current: 0,
            isCompleted: false
        },
        {
            type: 'money',
            count: 1000,
            current: 0,
            isCompleted: false
        }
    ];
    onChange: ()=>void;

    constructor(){
        this.addAnimal('chicken');
        const factory = new Factory(this, factories['f_egg0'], 1);
        factory.onFinish=()=>{this.onChange()}
        const factory1 = new Factory(this, factories['f_egg1'], 1);
        factory1.onFinish=()=>{this.onChange()}
        this.factories[0] = factory;
        this.factories[1] = factory1;
        this.car = new Car(this);
        this.plane = new Plane(this);
        this.water = new Water(this);
        this.water.onUpdate = ()=>{
            this.onChange();
        }
    }

    checkMissionTasks(){
        return this.missionTasks.find(mission => !mission.isCompleted) == null;
    }

    checkSum(sum: number){
        return sum<=this.money;
    }

    createFactory(variant: string, slotIndex: number){
        const newFactory = new Factory(this, factories[variant], slotIndex);
        const existingFactory = this.factories[slotIndex];
        if (existingFactory){
            existingFactory.destroy(); 
        }
        this.factories[slotIndex] = newFactory;
        this.onChange();
    }

    getAvailableFactories(){
        return this.factoriesSlots.map((slot, slotIndex)=>{
            return slot.filter((variant)=>{
                return variant !=this.factories[slotIndex]?.config.type;
            });
        })
    }

    addAnimal(type: keyof typeof animals){
        if (this.money < animals[type].price){
            return;
        }
        this.money -= animals[type].price;
        const animal = new Animal(type);
        animal.onPositionChange = ()=>{
            this.onChange();
        }
        animal.onObjectEmit = (type)=>{
            this.items.push(new Collectable(type, animal.lastPosition));
            this.onChange();
        }
        this.animals.push(animal);
        this.onChange?.();
    }

    collect(item: Collectable){
        this.items.splice(this.items.findIndex(it=>it==item), 1);
        this.storage.items.push(item);
        const mission = this.missionTasks.find(it=>it.type == item.type);
        if (mission){
            mission.current+=1;
        }
        if (mission && mission.current>=mission.count){
            mission.isCompleted = true;
        }
        const flying = {type:item.type, pathType:'', startPos: {...item.position}}
        this.flyingItems.push(flying);
        console.log('added, ', flying.startPos.x)
        setTimeout(()=>{
            this.flyingItems.splice(this.flyingItems.findIndex((it)=> it == flying), 1);
            console.log('pliced ', flying.startPos.x);
            this.onChange();
        }, 1000);
        this.onChange();
    }

    startFactory(factory: Factory){
        factory.startFactory();
        this.onChange();
    }

    makeGrass(x: number, y: number){
        this.water.makeGrass({x, y});
        this.onChange();
    }

    destroy(){
        this.animals.forEach(animal=>{
            animal.destroy();
        })
    }
}