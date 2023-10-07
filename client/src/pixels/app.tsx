import React, { useEffect, useRef, useState } from "react";
import { Pixels, IVector } from './pixels';
import './app.css';

export function App() {
    const canvasRef = useRef<HTMLCanvasElement>();
    const [game, setGame] = useState<Pixels>(null);
    const [tick, setTick] = useState(0);
    const [dragStart, setDragStart] = useState<{ cell: IVector, position: IVector }>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current;
        const context = canvasElement?.getContext('2d');
        if (!context){
            throw new Error();
        }
        const _game = new Pixels();
        _game.onGameState = () => {
            context.fillStyle = '#000';
            context?.fillRect(0, 0, canvasElement?.width, canvasElement?.height);

            _game.objects.forEach(it=>{
                context.fillStyle = it.type;
                context.fillRect(Math.floor(it.position.x * 2), Math.floor(it.position.y * 2), 2, 2);
                context.strokeStyle = '#444';
                it.connections.forEach(jt=>{
                    context.beginPath();
                    context.moveTo(it.position.x * 2, it.position.y *2);
                    context.lineTo(jt.position.x * 2, jt.position.y *2);  
                    context.stroke();
                    context.closePath();
                })
                
            })
            setTick(last => last + 1);
        }
        _game.start();
        setGame(_game);
        return ()=>{
            _game.stop();
        }
    }, []);

    return <div>
        <canvas ref={canvasRef} width={400} height={400}></canvas>
    </div>
}