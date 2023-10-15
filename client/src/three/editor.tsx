import React, { useEffect, useState } from "react";
import './editor.css';
import { Field } from "./field";
import { CellView } from "./app";
import { IVector } from "./game";
import { GameObject } from "./items/gameObject";
import { BoxCell } from "./items/box";
import { GrassCell } from "./items/grass";

const test = [
    '-------',
    '-++++--',
    '-+-+++-',
    '-+++++-',
    '---+++-',
    '----+--',
].map(it=>it.split(''));

const initial = new Array(10).fill(null).map(it=> new Array(10).fill('+'));

export function Editor() {
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
                        return [...last, new BoxCell(cellPosition)];
                    })
                }
                if (tool == 'grass'){
                    setObjects((last)=>{
                        return [...last, new GrassCell(cellPosition)];
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