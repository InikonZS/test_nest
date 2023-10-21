import React, { useEffect, useRef, useState } from "react";
import { generate } from '../neir/wf';
import './app.css';
import { pattern as initialPattern1 } from "../neir/wf";

const alpha = ' 123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const testPattern = [
    "                ",
    "                ",
    "       d66c     ",
    "      8    4    ",
    "     8      4   ",
    "    2        b  ",
    "    1        1  ",
    "    1        1  ",
    "    3        9  ",
    "     4      8   ",
    "      4    8    ",
    "       5667     ",
    "                "
];
let initialPattern = testPattern;

export function NeirView(){
    //const field = generate().map(it=> it.map(jt=>jt.map(cl=> cl.val).join('')).join(''));['     ', '     ', '     ', '     ', '     ',].map(it=>it.split(''))
    const [pattern, setPattern] = useState<Array<Array<string>>>(initialPattern.map(it=>it.split('')));
    const [field, setField] = useState<Array<Array<Array<string>>>>(null);
    const [tiles, setTiles] = useState<Array<string>>([' ', '1', '2', '3', '4', '5', '6', '7', '8']);
    const [selectedTile, setSelectedTile] = useState<string>(tiles[0]);
    const canvasRef = useRef<HTMLCanvasElement>();
    const [backUrl, setBackUrl] = useState('');
    const [eraser, setEraser] = useState(false);
    //const field = generate(pattern.map(it=>it.join(''))).map(it=> it.map(jt=>jt.map(cl=> cl.val)));
    useEffect(()=>{
        const generated = generate(pattern.map(it=>it.join('')), 50, 50).map(it=> it.map(jt=>jt.map(cl=> cl.val)));
        setField(generated);
    }, []);

    useEffect(()=>{
        const cr = canvasRef.current;
        if (cr){
            const ctx = cr.getContext('2d');
            ctx.strokeStyle = '#f90';
            ctx.globalCompositeOperation = "source-over";
            ctx.lineWidth = 4;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'square';
            if (eraser){
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.globalCompositeOperation = "destination-out";
            }
            cr.onpointerdown = (e)=>{
                let last = {x:e.offsetX, y:e.offsetY}
                cr.onpointermove = (e)=>{
                    ctx.beginPath();
                    ctx.moveTo(last.x, last.y);
                    ctx.lineTo(e.offsetX, e.offsetY);
                    ctx.stroke();
                    ctx.closePath();
                    last = {x:e.offsetX, y:e.offsetY}
                }
                window.addEventListener('pointerup', ()=>{
                    cr.onpointermove = null;
                    setBackUrl(()=>{
                        return canvasRef.current.toDataURL();
                    });
                })
            }
        }
    }, [/*canvasRef.current, */eraser, tiles]);
    return <div>
        <div>
            <div>
                <button onClick={()=>{
                    setEraser(last=>!last)
                }}>{eraser? 'eraser' : 'pen'}</button>
                <canvas className="canvas" ref={canvasRef} width={100 * tiles.length} height={100}></canvas>
            </div>
            <div className="row">
                {tiles.map(tile=>{
                    return <div className="wf_cell" style={{backgroundColor: selectedTile == tile ? '#444': ''}} onClick={(e) => {
                        setSelectedTile(tile);
                    }}>{tile}</div>
                })}
            </div>
            -
            <div>
                {pattern.map((row, y) => {
                    return <div className="row">
                    {row.map((cell, x) => {
                        return <div className="wf_cell" onClick={(e) => {
                            setPattern(last=>{
                                const newPattern = [...last.map(it=>[...it])];
                                newPattern[y][x] =selectedTile;
                                return newPattern;
                            })
                        }}>{cell}</div>
                    })}
                    </div>
                })}
            </div>
            -
            <div>
                <button onClick={()=>{
                    const generated = generate(pattern.map(it=>it.join('')), 60, 60).map(it=> it.map(jt=>jt.map(cl=> cl.val)));
                    setField(generated);
                }}>regenerate</button>
                <button onClick={()=>{
                    setPattern(last=>{
                        const newPattern = [...last.map(it=>[...it.map(()=>' ')])];
                        return newPattern;
                    })
                }}>clear pattern</button>
                <button onClick={()=>{
                    setTiles(last=> [...last, alpha[last.length]])
                }}>add tile</button>
                <button onClick={()=>{
                    console.log(pattern.map(it=>it.join('')));
                }}>save pattern</button>
            </div>
        </div>

        <div className="field">
            {field && field.map((row, y) => {
                return <div className="row">
                {row.map((cell, x) => {
                    return <div className="wf_cell" style={{
                        backgroundImage: `url(${backUrl})`,
                        backgroundSize: `calc(100% * ${tiles.length}) 100%`,
                        backgroundPositionX: `calc(-100% * ${tiles.findIndex(tile=>tile == cell[0])})`
                    }} 
                    onMouseDown={(e) => {
                    }}>{cell.join('')}</div>
                })}
                </div>
            })}
        </div>
    </div>
}