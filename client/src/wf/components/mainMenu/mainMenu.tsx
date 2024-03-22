import React, { useMemo, useState } from "react";
import './mainMenu.css';
import { IVector } from "../../core/IVector";

interface ILevelButtonData {
    id: number;
    position: IVector;
    //status: string;
    closest: number[];
}

const levelButtons = [
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
    //const [levelStatuses, setLevelStatuses] = useState<Array<string>>([]);

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

    return <div className="wf_mainMenu_wrapper">
        <div className="wf_mainMenu_back">
            {levelButtons.map(it=>{

                const levelStatus = actualLevelStatuses[it.id] || 'locked';

                return <div className={`wf_mainMenu_levelButton wf_mainMenu_levelButton_${levelStatus}`} 
                        style={{left: `${it.position.x / 10}%`, top: `${it.position.y / 10}%`}}
                        onClick={()=>{
                            onSelectLevel(it.id);
                        }}
                    >
                    {it.id}
                    <div onClick={()=>{
                        setCompletedLevel(it.id);
                    }}>p</div>
                </div>
            })}
        </div>
    </div>
}