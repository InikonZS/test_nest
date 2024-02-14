import React, { useState, useMemo } from "react";
import { GameField } from "../gameField/gameField";
import { Editor } from "../editor/editor";
import { levels } from '../../levels/levelList';
import "./gameMenu.css";

while (levels.length < 12) {
  levels.push(null);
}

export function GameMenu() {
  const [levelList, setLevelList] = useState(levels);
  const [editorLevel, setEditorLevel] = useState(null);
  const [startedLevel, setStartedLevel] = useState<number | null>(null);
  const [isShowEditor, setShowEditor] = useState(false);

  const startedLevelData = useMemo(() => {
    if (startedLevel === null) {
      return null
    }
    if (editorLevel && startedLevel == -1) {
      return editorLevel;
    }
    return levelList[startedLevel]
  }, [startedLevel, levelList, editorLevel]);

  return <div className="base_screen">

    {
      startedLevelData == null && <button onClick={() => {
        setShowEditor((last) => !last)
      }}>{isShowEditor ? 'hide editor' : 'show editor'}</button>
    }

    {
      !startedLevelData && !isShowEditor && <div>
        <div className="menu_header">Select level</div>
        <div className="level_list">
          {
            levelList.map((level, index) => {
              return <div className="level_button_wrapper">
                <button className={`level_button ${level ? '' : 'level_button_locked'}`} onClick={() => {
                  if (level){
                    setStartedLevel(index);
                  }
                }}>
                  {index + 1}
                </button>
              </div>
            })
          }
        </div>
      </div>
    }

    {
      startedLevelData !== null && <GameField levelData={startedLevelData} onClose={() => {
        setStartedLevel(null);
      }}></GameField>
    }

    {
      isShowEditor && <Editor onTest={(level) => {
        setEditorLevel(level);
        setStartedLevel(-1);
      }}></Editor>
    }

  </div>
}