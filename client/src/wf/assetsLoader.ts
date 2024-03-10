import egg0 from './assets/egg0.png';
import egg1 from './assets/egg1.png';
import egg2 from './assets/egg2.png';
import egg3 from './assets/egg3.png';
import meal from './assets/meal.png';

import meat0 from './assets/meat0.png';
import meat1 from './assets/meat1.png';
import meat2 from './assets/meat2.png';
import meat3 from './assets/meat3.png';
import pack from './assets/pack.png';

import milk0 from './assets/milk0.png';
import milk1 from './assets/milk1.png';
import milk2 from './assets/milk2.png';
import milk3 from './assets/milk3.png';
import bottle from './assets/bottle.png';

import chicken from './assets/chicken.png';
import pig from './assets/pig.png';
import cow from './assets/cow.png';

import car0 from './assets/car0.png';
import car1 from './assets/car1.png';
import car2 from './assets/car2.png';
import car3 from './assets/car3.png';

import chicken_0 from './assets/chicken/chicken_0.png';
import chicken_45 from './assets/chicken/chicken_45.png';
import chicken_90 from './assets/chicken/chicken_90.png';
import chicken_135 from './assets/chicken/chicken_135.png';
import chicken_180 from './assets/chicken/chicken_180.png';
import chicken_225 from './assets/chicken/chicken_225.png';
import chicken_270 from './assets/chicken/chicken_270.png';
import chicken_315 from './assets/chicken/chicken_315.png';

import factory_egg0 from './assets/factory_egg0.png';

const chickenList: Record<string, string> = {chicken_0, chicken_45, chicken_90, chicken_135, chicken_180, chicken_225, chicken_270, chicken_315};
const assetList: Record<string, string> = {egg0, egg1, egg2, egg3, meal, meat0, meat1, meat2, meat3, pack, milk0, milk1, milk2, milk3, bottle, chicken, pig, cow, car0, car1, car2, car3, factory_egg0, ...chickenList};

export type IAssets = Record<string, {blob: Blob, objectUrl: string}>;
export class AssetsLoader{
    assets: Record<string, {blob: Blob, objectUrl: string}> = {};
    load(){
        return Promise.all(Object.keys(assetList).map(assetKey=>{
            return fetch(assetList[assetKey]).then(response=>{
                return response.blob();
            }).then(blob=>{
                this.assets[assetKey] = {
                    blob,
                    objectUrl: URL.createObjectURL(blob)
                }
            })
        }));
    }
}