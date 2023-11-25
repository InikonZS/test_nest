import React, { useEffect, useMemo, useState } from "react";
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
    const [size, setSize] = useState<IVector>({x: 10, y: 10});
    const [field, setField] = useState(initial);
    const [tool, setTool] = useState('back');
    const [objects, setObjects] = useState<Array<GameObject>>([]);

    useEffect(()=>{
        if (field.length < size.y){
            setField((last)=>{
                return [...last, new Array(size.x).fill('+')];
            })  
        }

        setField((last)=> {
            const newField: typeof last = [];
            last.forEach(it=>{
                const newRow = [...it];
                while (newRow.length < size.x){
                    newRow.push('+');
                } 
                newField.push(newRow);
            });
            return newField;
        })  
        
    }, [size]);

    const croppedField = useMemo(()=>{
        return field.slice(0, size.y).map(row=>row.slice(0, size.x));
    }, [size, field]);

    const croppedObjects = useMemo(()=>{
        return objects.filter(it=>it.position.x<size.x && it.position.y<size.y);
    }, [size, objects]);

    return <div className="editor_wrapper" style={{'--field-x': size.x, '--field-y': size.y}}>
        <div className="editor_panel">
            <div>
              <span>size x</span>
              <input type="number" min={5} value={size.x} onChange={(e)=>{
                setSize(last=>({...last, x: e.target.valueAsNumber}));
              }}></input>  
            </div>

            <div>
              <span>size y</span>
              <input type="number" min={5} value={size.y} onChange={(e)=>{
                setSize(last=>({...last, y: e.target.valueAsNumber}));
              }}></input>  
            </div>
            
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
                const level = {
                    moves: 30,
                    field: croppedField,
                    objects: croppedObjects.map(it=> ({position: {...it.position}, type: Number(it)}))
                }
                console.log(level);
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
            <Field data={croppedField} onCellClick = {(cellPosition)=>{
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
                {croppedObjects.sort((a: any, b: any) => b.id - a.id).map((cell: any) => {
                    return <CellView key={cell.id} cell={cell} setDragStart={() => { }}></CellView>
                })}
            </div>
        </div>
    </div>
}