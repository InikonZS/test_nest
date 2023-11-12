import React, { useEffect, useState } from "react";
import './editor.css';
import { Field } from "../gameField/field";
import { CellView } from "../cellView/cellView";
import { IVector } from "../../core/game";
import { GameObject } from "../../core/items/gameObject";
import { BoxCell } from "../../core/items/box";
import { GrassCell } from "../../core/items/grass";

const test = [
    '-------',
    '-++++--',
    '-+-+++-',
    '-+++++-',
    '---+++-',
    '----+--',
].map(it=>it.split(''));

const initial = new Array(10).fill(null).map(it=> new Array(10).fill('+'));

export function Editor({onTest}: {onTest: (level: {moves: number, field: Array<Array<string>>, objects: Array<{position:IVector, type: number}>})=>void}) {
    const [field, setField] = useState(initial);
    const [tool, setTool] = useState('back');
    const [objects, setObjects] = useState<Array<GameObject>>([]);
    return <div className="editor_wrapper">
        <div className="editor_panel">
            <button className={`tool ${tool == 'back' ? 'tool_selected': ''}`} onClick={()=>{
                setTool('back');
            }}>back</button>
            <button className={`tool ${tool == 'box' ? 'tool_selected': ''}`} onClick={()=>{
                setTool('box');
            }}>box</button>
            <button className={`tool ${tool == 'grass' ? 'tool_selected': ''}`} onClick={()=>{
                setTool('grass');
            }}>grass</button>
            <button className={`tool`} onClick={()=>{
                console.log(field, objects.map(it=> ({position: {...it.position}, type: Number(it)})));
            }}>save</button>
            <button className={`tool`} onClick={()=>{
                onTest({
                    moves: 35,
                    field, 
                    objects: objects.map(it=> ({position: {...it.position}, type: Number(it)}))
                });
            }}>test</button>
        </div>
        <div className="editor_field">
            <Field data={field} onCellClick = {(cellPosition)=>{
                if (tool == 'back'){
                    setField(last=>{
                        last[cellPosition.y][cellPosition.x] = last[cellPosition.y][cellPosition.x] == '-' ? '+' : '-';
                        return [...last];
                    })
                }
                if (tool == 'box'){
                    setObjects((last)=>{
                        return [...last, new BoxCell(null, cellPosition)];
                    })
                }
                if (tool == 'grass'){
                    setObjects((last)=>{
                        return [...last, new GrassCell(null, cellPosition)];
                    })
                }
            }}></Field>
            <div className="editor_objects">
                {objects.sort((a: any, b: any) => b.id - a.id).map((cell: any) => {
                    return <CellView key={cell.id} cell={cell} setDragStart={() => { }}></CellView>
                })}
            </div>
        </div>
    </div>
}