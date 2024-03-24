import { animals } from "./animal";
import { factories } from "./factory";

export interface ILevelData{
    startMoney: number,
    startAnimals: Array<keyof typeof animals>,
    factories: Array<IFactoryData>,
    factoriesSlots: Array<Array<keyof typeof factories>>,
    missions: Array<IMissionData>,
    timeLimits: [number, number, number]
}

interface IMissionData{
    type: string,
    count: number,
}

interface IFactoryData{
    type: keyof typeof factories,
    slotIndex: number,
    level: number
}