import { IVector } from "./IVector";

export const toSvgPath = ((points:IVector[], color:string)=>{
    const result = [];
    points.forEach((point, i)=>{
        if (i==0){
            result.push(`M ${point.x} ${point.y}`);
        } else {
            result.push(`L ${point.x} ${point.y}`);
        }
    });
    result.push('z');
    return `<path fill="#${color}" d="${result.join(' ')}" />`;
});