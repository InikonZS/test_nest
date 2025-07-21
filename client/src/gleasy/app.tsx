import React, { useEffect, useRef, useState } from "react";
import { GameScene } from "./core/gameScene";
import './app.css'

export function App(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fps, setFps] = useState({limited: 0, framed: 0});

    useEffect(()=>{
        if (canvasRef.current){
            const scene = new GameScene(canvasRef.current);
            scene.onTick = ()=>{
                setFps({limited: scene.fps, framed: scene.fpsnl});
            }
        }

    }, []);

    return <div className="appgl1_wrapper">
        <canvas className="appgl1_canvas" ref={canvasRef} width={800} height={600} style={{border: '1px solid'}}>
        </canvas>
        <div className="appgl1_map_block">
            <div>fps: {fps.limited.toFixed(2)} / {fps.framed.toFixed(2)}</div>
        </div>
    </div>
}