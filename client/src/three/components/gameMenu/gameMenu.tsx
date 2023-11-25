import React, { useState, useMemo } from "react";
import { GameField } from "../gameField/gameField";
import { Editor } from "../editor/editor";
import { levels } from '../../levels/levelList';

export function GameMenu(){
    const [levelList, setLevelList] = useState(levels);
    const [editorLevel, setEditorLevel] = useState(null);
    //const [isStarted, setStarted] = useState(false);
    const [startedLevel, setStartedLevel] = useState<number | null>(null);
    const [isShowEditor, setShowEditor] = useState(false);
    const startedLevelData = useMemo(()=>{
      if (startedLevel === null){
        return null
      }
      if (editorLevel && startedLevel == -1){
        return editorLevel;
      }
      return levelList[startedLevel]
    }, [startedLevel, levelList, editorLevel]);
    return <div className="base_screen">
  
    {startedLevelData == null && <button onClick={()=>{
        setShowEditor((last)=> !last)
      }}>{isShowEditor ? 'hide editor' : 'show editor'}</button>}
      { !startedLevelData && <div>
      {
        levelList.map((level, index)=>{
          return <div>
            <button onClick={()=>{
              setStartedLevel(index);
            }
              
            }>{index + 1}</button>
          </div>
        })
      }
      </div>
    }
      {/*isStarted == false && <div>
        <button onClick={()=>{
          setStarted(true);
        }}>start</button>
      </div>*/}
      {startedLevelData !== null && <GameField levelData={startedLevelData} onClose={()=>{
        //setStarted(false);
        setStartedLevel(null);
      }}></GameField>}
        {isShowEditor && <Editor onTest={(level)=>{
        setEditorLevel(level);
        setStartedLevel(-1);
      }}></Editor>}
      
    </div>
  }