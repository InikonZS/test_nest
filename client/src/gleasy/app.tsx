import React, { useEffect, useRef, useState } from "react";
import { GameScene } from "./core/gameScene";
import './app.css'

export function App(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fps, setFps] = useState({limited: 0, framed: 0});
    const [hover, setHover] = useState<any>(null);
    const [gscene, setGscene] = useState<GameScene>();

    useEffect(()=>{
        if (canvasRef.current){
            const scene = new GameScene(canvasRef.current);
            setGscene(scene);
            scene.onTick = ()=>{
                setFps({limited: scene.fps, framed: scene.fpsnl});
                setHover(scene.hover);
            }
        }

    }, []);

    const planes = [
        {a: 'a', b: 'b', c: 'c', d: 'd'},
        {a: 'a1', b: 'b1', c: 'c1', d: 'd1'},
        {a: 'a', b: 'b', c: 'b1', d: 'a1'},
        {a: 'b', b: 'c', c: 'c1', d: 'b1'},
        {a: 'c', b: 'd', c: 'd1', d: 'c1'},
        {a: 'd', b: 'a', c: 'a1', d: 'd1'},
    ]
    return <div className="appgl1_wrapper">
        <canvas className="appgl1_canvas" ref={canvasRef} width={800} height={600} style={{border: '1px solid'}}onClick={()=>{
            if (hover){
                gscene.vf.setPoint('t', hover.original.x+1, hover.original.y, hover.original.z);
            }
        }}>
        </canvas>
        <div className="appgl1_overlay">
            {['a', 'b', 'c', 'd', 'a1', 'b1', 'c1', 'd1'].map(it=>{
                if (!hover){
                    return;
                }
                let color = 'red';
                if (!(Object.values(planes[hover.plane]).includes(it))){
                    color = '#fff3';
                }
                const size =  50 / hover[it].z + 'px';
                return <div className="appgl1_hover_point" style={{left:hover[it].x + 'px', top: hover[it].y + 'px', width: size, height: size, backgroundColor: color}}></div>
            })}
        </div>
        <div className="appgl1_map_block">
            <div>fps: {fps.limited.toFixed(2)} / {fps.framed.toFixed(2)}</div>
        </div>
    </div>
}