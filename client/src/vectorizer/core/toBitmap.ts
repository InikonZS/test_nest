import { IVector } from "./IVector";

export function toBitmap(ctx: CanvasRenderingContext2D, pos: IVector, threshold: number): [string[][], string] {
    const canvas = ctx.canvas;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const selectColor: Array<number> = []; 
    for (let k = 0; k<3; k++){
        selectColor.push(data.data[pos.y * data.width * 4 + pos.x * 4 + k]);
    }
    const arr: Array<Array<string>> = [];
    for (let i = 0; i < data.height; i++) {
        const row: Array<string> = [];
        for (let j = 0; j < data.width; j++) {
            const colors: Array<number> = [];
            for (let k = 0; k<3; k++){
                colors.push(data.data[i * data.width * 4 + j * 4 + k]);
            }
            const maxDiff = Math.max(...colors.map((cl, cli)=> Math.abs(cl  - selectColor[cli])))
            //row.push(data.data[i * data.width * 4 + j * 4] == 0 ? '1' : '0');
            row.push(maxDiff < threshold ? '1' : '0');
        }
        arr.push(row);
    }
    return [arr, selectColor.map(it=>(it.toString(16).length == 1? '0' : '')+it.toString(16)).join('')];
}