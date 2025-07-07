import React, { useEffect, useRef } from "react";
import {GameScene} from "./core/gameScene";
import './app.css'

export function App(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mapRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        if (canvasRef.current){
            const scene = new GameScene(canvasRef.current, mapRef.current);
        }

    }, []);

    return <div className="appgl_wrapper">
        <canvas className="appgl_canvas" ref={canvasRef} width={800} height={600} style={{border: '1px solid'}}>
        </canvas>
        <canvas className="appgl_map" ref={mapRef} width={240} height={240} style={{border: '1px solid'}}>
        </canvas>
    </div>
}