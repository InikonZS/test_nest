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
        if (!editorMode){
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

    return <div className="wf_mainMenu_wrapper">
        <div className="wf_mainMenu_editTools">
            <button>add/move</button>
            <button>relations</button>
        </div>
        <div className="wf_mainMenu_back" ref={backRef}
            onClick={(downEvt)=>{
                addItem(downEvt) 
            }}
        >
            {levelButtons.map((it, i)=>{

                const levelStatus = actualLevelStatuses[it.id] || 'locked';

                return editorMode ? 
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
                            onMouseDown={(evt)=>handleEditorMouse(evt, i)}
                            onClick={(evt)=> evt.stopPropagation()}
                        >
                        {it.id}
                    </div> 
                    {
                        it.closest.map(jt=>{
                            const itemWidth = 1000 * 35 / backRef.current?.getBoundingClientRect().width || 1;
                            const itemHeight = 1000 * 35 / backRef.current?.getBoundingClientRect().height || 1;
                            const closestItem = levelButtons[jt];
                            const w = Math.abs(closestItem.position.x - it.position.x) / 1000 * (backRef.current?.getBoundingClientRect().width || 1);
                            const h = Math.abs(closestItem.position.y - it.position.y) / 1000 * (backRef.current?.getBoundingClientRect().height || 1);
                            return <svg width={Math.max(w, 2)} height={Math.max(h, 2)} style={{
                                position: 'absolute',
                                left: (Math.min(closestItem.position.x, it.position.x) + itemWidth / 2) / 10 + '%',
                                top: (Math.min(closestItem.position.y, it.position.y) + itemHeight / 2) / 10 + '%',
                                stroke: '#0009',
                                pointerEvents: 'none',
                                zIndex: 1,
                            }}>
                                <path d={(closestItem.position.y - it.position.y) * (closestItem.position.x - it.position.x) < 0 ? `M ${w} 0 L 0 ${h}`: `M 0 0 L ${w} ${h}`}></path>
                            </svg>
                        })
                    }
                    </>
                )
            })}
        </div>
    </div>
}