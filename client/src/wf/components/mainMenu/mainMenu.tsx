import React, { useMemo, useRef, useState } from "react";
import './mainMenu.css';
import { IVector } from "../../core/IVector";

interface ILevelButtonData {
    id: number;
    position: IVector;
    //status: string;
    closest: number[];
}

const _levelButtons = [
    {
        id: 0,
        position: {
            x: 100,
            y: 100
        },
        closest: [1]
    },
    {
        id: 1,
        position: {
            x: 150,
            y: 150
        },
        closest: [2]
    },
    {
        id: 2,
        position: {
            x: 200,
            y: 200
        },
        closest: [3, 4, 5]
    },
    {
        id: 3,
        position: {
            x: 250,
            y: 250
        },
        closest: []
    },
    {
        id: 4,
        position: {
            x: 250,
            y: 150
        },
        closest: []
    },
    {
        id: 5,
        position: {
            x: 150,
            y: 250
        },
        closest: [6]
    },
    {
        id: 6,
        position: {
            x: 100,
            y: 300
        },
        closest: []
    },
];

interface IMainMenuProps{
    onSelectLevel: (id: number)=>void;
    levelStatuses: Array<string>;
    onChangeLevelStatuses: (id: number)=>void;
}

export function MainMenu({onSelectLevel, levelStatuses, onChangeLevelStatuses}: IMainMenuProps){
    const [levelButtons, setLevelButtons] = useState(_levelButtons);
    const [editorMode, setEditorMode] = useState<boolean>(false);
    const [editorTool, setEditorTool] = useState<string>('add');
    const [relationStart, setRelationStart] = useState<number>(-1);
    const backRef = useRef<HTMLDivElement>();

    const getActualLevelStatuses = ()=>{
        const newStatuses: Array<string> = [];
        levelStatuses.forEach((it, i)=>{
            if (it == 'completed'){
                newStatuses[i] = it;
            }
        });
        if (!newStatuses[0]){
            newStatuses[0] = 'opened';
        }
        levelButtons.forEach(it=>{
            const status = levelStatuses[it.id];
            if (status == 'completed'){
                it.closest.forEach(closestId=>{
                    newStatuses[closestId] = newStatuses[closestId] != 'completed' ? 'opened' : 'completed';
                })
            }
        });
        return newStatuses;
    }

    const actualLevelStatuses = useMemo(()=>{
        return getActualLevelStatuses();
    }, [levelStatuses]);

    const setCompletedLevel = (id: number)=>{
        /*setLevelStatuses(last=>{
            const next = [...last];
            next[id] = 'completed';
            return next;
        });*/
        onChangeLevelStatuses(id);
    }

    const handleEditorMouse = (downEvt: React.MouseEvent<HTMLDivElement>, buttonIndex: number)=>{
        downEvt.stopPropagation();
        const downVector = {x: downEvt.nativeEvent.offsetX, y: downEvt.nativeEvent.offsetY};
        const bounds = backRef.current.getBoundingClientRect();
        const handleMove = (moveEvt: MouseEvent)=>{
            const moveVector = {x: moveEvt.clientX - bounds.left, y: moveEvt.clientY - bounds.top}
            setLevelButtons(last=>{
                const newButtons = [...last];
                const currentButton = newButtons[buttonIndex];
                currentButton.position.x = (moveVector.x - downVector.x) / bounds.width * 1000;
                currentButton.position.y = (moveVector.y - downVector.y) / bounds.height * 1000;
                return newButtons;
            });
        }    
        const handleUp = (upEvt: MouseEvent)=>{
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);   
        }  
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);                   
    }

    const addItem = (downEvt: React.MouseEvent<HTMLDivElement>)=>{
        if (editorMode){
            setLevelButtons(last=>{
                const newButtons = [...last];
                const button: ILevelButtonData = {
                    id: last.length,
                    position: {
                        x: 100,
                        y: 300
                    },
                    closest: []
                };
                const bounds = backRef.current.getBoundingClientRect();
                const downVector = {x: downEvt.nativeEvent.clientX - bounds.left, y: downEvt.nativeEvent.clientY - bounds.top};
                button.position.x = (downVector.x - 35 / 2) / bounds.width * 1000;
                button.position.y = (downVector.y - 35 / 2) / bounds.height * 1000;
                newButtons.push(button);
                return newButtons;
            });
        }
    }

    const deleteItem = (buttonIndex: number)=>{
        setLevelButtons(last=>{
            const newButtons = last.map(btn=>{
                if (btn.id == buttonIndex){
                    return null;
                }
                return {
                    ...btn,
                    id: btn.id < buttonIndex ? btn.id : btn.id - 1,
                    closest: btn.closest.map(cls=> cls < buttonIndex ? cls : cls - 1)
                }
            }).filter(it=>it);
            return newButtons;
        });
    }

    return <div className="wf_mainMenu_wrapper">
        <div className="wf_mainMenu_editTools">
            <button onClick={()=>setEditorMode(last=>!last)} className={`wf_editorTool ${editorMode ? 'wf_editorTool_active':''}`}>edit/play</button>
            {editorMode && <button onClick={()=>setEditorTool('add')} className={`wf_editorTool ${editorTool == 'add'? 'wf_editorTool_active':''}`}>add/move</button>}
            {editorMode && <button onClick={()=>setEditorTool('rel')} className={`wf_editorTool ${editorTool == 'rel'? 'wf_editorTool_active':''}`}>relations</button>}
            {editorMode && <button onClick={()=>setEditorTool('del')} className={`wf_editorTool ${editorTool == 'del'? 'wf_editorTool_active':''}`}>delete</button>}
        </div>
        <div className="wf_mainMenu_back" ref={backRef}
            onClick={(downEvt)=>{
                if (editorTool == 'add'){
                    addItem(downEvt) 
                }
            }}
        >
            {levelButtons.map((it, i)=>{

                const levelStatus = actualLevelStatuses[it.id] || 'locked';

                return !editorMode ? 
                (
                    <div className={`wf_mainMenu_levelButton wf_mainMenu_levelButton_${levelStatus}`} 
                            style={{left: `${it.position.x / 10}%`, top: `${it.position.y / 10}%`}}
                            onClick={()=>{
                                onSelectLevel(it.id);
                            }}
                        >
                        {it.id}
                        <div onClick={(e)=>{
                            e.stopPropagation();
                            setCompletedLevel(it.id);
                        }}>p</div>
                    </div>
                ) : (
                    <>
                    <div className={`wf_mainMenu_levelButton wf_mainMenu_levelButton_${levelStatus}`} 
                            style={{left: `${it.position.x / 10}%`, top: `${it.position.y / 10}%`}}
                            onMouseDown={(evt)=>{
                                if (editorTool == 'add'){
                                    handleEditorMouse(evt, i)
                                }
                                if (editorTool == 'rel'){
                                    setRelationStart(i);
                                    const handleUp = ()=>{
                                        console.log('removed rel start');
                                        setRelationStart(-1);
                                        window.removeEventListener('mouseup', handleUp);
                                    }
                                    window.addEventListener('mouseup', handleUp);
                                }
                            }}
                            onMouseUp={()=>{
                                if (editorTool=='rel' && relationStart !=-1){
                                    setLevelButtons(last=>{
                                        const newButtons = [...last];
                                        const currentButton = newButtons[relationStart];
                                        if (currentButton.closest.includes(i)){
                                            currentButton.closest = currentButton.closest.filter(it=>it!=i);
                                        } else {
                                            currentButton.closest.push(i);
                                        }
                                        return newButtons;
                                    });
                                }
                            }}
                            onClick={(evt)=> {
                                evt.stopPropagation();
                                if (editorTool == 'del'){
                                    deleteItem(i)
                                }
                            }}
                        >
                        {it.id}
                    </div> 
                    {
                        it.closest.map(jt=>{
                            const kw = backRef.current?.getBoundingClientRect().width || 1;
                            const kh = backRef.current?.getBoundingClientRect().height || 1;
                            const itemWidth = 1000 * 35 / kw;
                            const itemHeight = 1000 * 35 / kh;
                            const closestItem = levelButtons[jt];
                            const w = Math.abs(-closestItem.position.x + it.position.x) / 1000 * kw;
                            const h = Math.abs(-closestItem.position.y + it.position.y) / 1000 * kh;
                            const ang = Math.atan2(-closestItem.position.x * kw + it.position.x * kw, -closestItem.position.y *kh + it.position.y*kh);
                            let arrowAngle = Math.PI / 12;
                            let arrowLength = 14;
                            let arrowA = `M 10 10 L ${Math.sin(ang + arrowAngle) * arrowLength +10} ${Math.cos(ang + arrowAngle) * arrowLength +10} L ${Math.sin(ang - arrowAngle) * arrowLength +10} ${Math.cos(ang - arrowAngle) * arrowLength +10} z`;
                            let arrowDw = `M ${w+10} ${10} L ${Math.sin(ang + arrowAngle) * arrowLength +10 + w} ${Math.cos(ang + arrowAngle) * arrowLength +10} L ${Math.sin(ang - arrowAngle) * arrowLength +10 + w} ${Math.cos(ang - arrowAngle) * arrowLength +10} z`;
                            let arrowDh = `M ${w+10} ${h+10} L ${Math.sin(ang + arrowAngle) * arrowLength +10 +w } ${Math.cos(ang + arrowAngle) * arrowLength +10 +h} L ${Math.sin(ang - arrowAngle) * arrowLength +10 +w } ${Math.cos(ang - arrowAngle) * arrowLength +10 +h} z`;
                            let arrowDh0 = `M ${10} ${h+10} L ${Math.sin(ang + arrowAngle) * arrowLength +10 } ${Math.cos(ang + arrowAngle) * arrowLength +10 +h} L ${Math.sin(ang - arrowAngle) * arrowLength +10 } ${Math.cos(ang - arrowAngle) * arrowLength +10 +h} z`;
                            let arrowD = !(ang>=Math.PI /2 && ang<=Math.PI)?arrowDw: arrowDh0;
                            let arrow = !(ang>-Math.PI && ang<-Math.PI /2) ? arrowA : arrowDh;

                            return <svg width={w+20} height={h+20} style={{
                                position: 'absolute',
                                left: (Math.min(closestItem.position.x, it.position.x) + itemWidth / 2 -10000 / backRef.current?.getBoundingClientRect().width) / 10  + '%',
                                top: (Math.min(closestItem.position.y, it.position.y) + itemHeight / 2 -10000 / backRef.current?.getBoundingClientRect().height) / 10  + '%',
                                stroke: '#0009',
                                pointerEvents: 'none',
                                zIndex: 1,
                            }}>
                                <path d={(-closestItem.position.y + it.position.y) * (-closestItem.position.x + it.position.x) <= 0 ? `M ${w + 10} 10 L 10 ${h + 10} ${arrowD}`: `M 10 10 L ${w + 10} ${h + 10} ${arrow}`}></path>
                            </svg>
                        })
                    }
                    </>
                )
            })}
        </div>
    </div>
}