import { ILevelData } from "./ILevelData";

export const levels: Array<ILevelData> = [
    {
        startMoney: 900,
        startAnimals: ['chicken'],
        factories: [
            {
                type: 'f_egg0', 
                slotIndex: 0, 
                level: 0
            },
            {
                type: 'f_egg1', 
                slotIndex: 1, 
                level: 0
            },
        ],
        factoriesSlots: [
            ['f_egg0'],
            ['f_egg1'],
            ['f_egg2'],
            [],
            [],
            []
        ],
        missions: [
            {
                type: 'egg0',
                count: 5,
            },
            {
                type: 'egg1',
                count: 2,
            },
            {
                type: 'money',
                count: 1000,
            }
        ],
        timeLimits: [100, 150, 200]
    },

    {
        startMoney: 900,
        startAnimals: ['chicken', 'chicken', 'chicken'],
        factories: [
            {
                type: 'f_egg0', 
                slotIndex: 0, 
                level: 3
            },
            {
                type: 'f_egg1', 
                slotIndex: 1, 
                level: 2
            },
        ],
        factoriesSlots: [
            ['f_egg0'],
            ['f_egg1'],
            ['f_egg2'],
            [],
            [],
            []
        ],
        missions: [
            {
                type: 'egg0',
                count: 5,
            },
            {
                type: 'egg2',
                count: 1,
            },
            {
                type: 'money',
                count: 1000,
            },
            {
                type: 'chicken',
                count: 4,
            }
        ],
        timeLimits: [100, 150, 200]
    }
]