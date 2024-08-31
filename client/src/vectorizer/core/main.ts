import { processFile } from './processFile';
import { findBorder } from './findBorder';
import { optimizeByDistances } from './optimizeBorder';
import { toSvgPath } from './toSvgPath';
import { checkFigure } from './fillFigure';
import { toBitmap } from './toBitmap'
import { IVector } from './IVector';

export function initUI() {
    /*const ctx = canvas.getContext('2d');
    let img;
    input.onchange = () => {
        processFile(input.files[0], (image) => {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            img = image;
            ctx.drawImage(image, 0, 0);
        });
    };
    threshold.onchange = ()=>{
        canvas.onclick();
    }
    let clickPoint;*/
}

export function convertByClick(ctx: CanvasRenderingContext2D, clickPoint: IVector, originalImg:HTMLImageElement, threshold: number){
    const canvas = ctx.canvas;
    console.log('1234');
    const bounds = canvas.getBoundingClientRect();
    const scale = {x: bounds.width / canvas.width, y: bounds.height / canvas.height};
    //const clickPos = {x: Math.floor(e.offsetX / scale.x), y: Math.floor(e.offsetY / scale.y)};
    //console.log(clickPos);
    ctx.drawImage(originalImg, 0, 0);
        //const clickPoint = { x: e.offsetX, y: e.offsetY }; 
    //}
    /*clickPoint = e ?{ x: clickPos.x, y: clickPos.y } : clickPoint;
    if (!clickPoint){
        return;
    }*/
    //ctx.fillRect(clickPoint.x, clickPoint.y, 5, 5);
    const [bitmap, color] = toBitmap(ctx, clickPoint, threshold);
    const figPoints = checkFigure(bitmap.map((row, y)=>row.map((cell, x)=>({value: cell, isLocked: cell == '0', x, y}))), clickPoint);
    const clearBitmap = new Array(bitmap.length).fill(null).map(it=>new Array(bitmap[0].length).fill('0'));
    figPoints.forEach(it=> {
        clearBitmap[it.y][it.x] = '1';
        //ctx.fillRect(it.x, it.y, 1,1);
    });
    const clickVal = clearBitmap[clickPoint.y][clickPoint.x];
    let point: IVector; //= {...clickPoint};

    /*while (clearBitmap[clickPoint.y][point.x+1] == clickVal){
        point.x+=1;
    }*/
    clearBitmap.forEach((row, y) => {
        row.forEach((val, x) => {
            if (!point && val == '1') {
                point = { x, y }
            }
        })
    });

    const border = findBorder(clearBitmap, point);
    console.log('border', border);
    const optimized = optimizeByDistances(border);
    return toSvgPath(optimized, color);
    //svg.innerHTML += toSvgPath(optimized, color);
}