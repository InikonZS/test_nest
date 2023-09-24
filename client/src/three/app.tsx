import React, { useEffect, useState } from "react";
import { Game, IVector } from './game';
import './app.css';

export function App() {
  const [game, setGame] = useState<Game>(null);
  const [tick, setTick] = useState(0);
  const [dragStart, setDragStart] = useState<{ cell: IVector, position: IVector }>(null);

  useEffect(() => {
    const _game = new Game();
    _game.onGameState = () => {
      setTick(last => last + 1);
    }
    _game.check();
    setGame(_game);
  }, []);

  useEffect(() => {
    if (!dragStart) return;
    const handleUp = (e: MouseEvent) => {
      const offset = {
        x: e.clientX - dragStart.position.x,
        y: e.clientY - dragStart.position.y
      }
      const direction = {
        x: Math.abs(offset.x) > Math.abs(offset.y) ? Math.sign(offset.x) : 0,
        y: Math.abs(offset.y) > Math.abs(offset.x) ? Math.sign(offset.y) : 0
      }
      game.move(dragStart.cell, direction);
      setDragStart(null);
    }
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
    }
  }, [dragStart]);

  return (
    <div className="field">
      {game && game.field.map((row, y) => {
        return <div className="row">
          {row.map((cell, x) => {
            return <div className="cell" style={{'backgroundColor': ['#fff', '#f00', '#00f', '#0f0', '#ff0'][cell]}} onMouseDown={(e) => {
              setDragStart({
                position: {
                  x: e.clientX,
                  y: e.clientY
                },
                cell: {
                  x, y
                }
              })
            }}>{cell}</div>
          })}
        </div>
      })}
    </div>
  )
}