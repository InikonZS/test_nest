import React, { useEffect, useRef, useState } from "react";
import {GameScene} from "./core/gameScene";
import './app.css'

export function App(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mapRef = useRef<HTMLCanvasElement>(null);
    const [fps, setFps] = useState(0);

    useEffect(()=>{
        if (canvasRef.current){
            const scene = new GameScene(canvasRef.current, mapRef.current);
            scene.onTick = ()=>{
                setFps(scene.fps);
            }
        }

    }, []);

    return <div className="appgl_wrapper">
        <canvas className="appgl_canvas" ref={canvasRef} width={800} height={600} style={{border: '1px solid'}}>
        </canvas>
        <div className="appgl_map_block">
            <canvas className="appgl_map" ref={mapRef} width={2840} height={2840} style={{border: '1px solid'}}>
            </canvas>
            <div>fps: {fps.toFixed(2)}</div>
        </div>
    </div>
}