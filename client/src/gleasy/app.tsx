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
    ];

    const planeNormals = [
        {x: 0, y: 0, z: 1},
        {x: 0, y: 0, z: -1},
        {x: 0, y: -1, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: -1, y: 0, z: 0},
    ];
    const clamp = (value: number, min: number, max: number)=>{
        return Math.max(Math.min(value, max), min);
    }
    return <div className="appgl1_wrapper">
        <canvas className="appgl1_canvas" ref={canvasRef} width={800} height={600} style={{border: '1px solid'}} onMouseUp={(e)=>{
            //e.preventDefault();
            console.log('right click')
            if (hover && e.button == 2){
                gscene.vf.setPoint(
                    {type: 'air', light: 0}, 
                    clamp(hover.original.x, 0, gscene.vf.width - 1), 
                    clamp(hover.original.y, 0, gscene.vf.height - 1), 
                    clamp(hover.original.z, 0, gscene.vf.depth - 1)
                );
            }
        }} onClick={(e)=>{
            console.log(hover?.plane, 'button - ', e.button);
            if (hover && e.button == 0){
                gscene.vf.setPoint(
                    {type: 'block', mx: Math.floor(Math.random() * 4), my: Math.floor(Math.random() * 2)}, 
                    clamp(hover.original.x+planeNormals[hover.plane].x, 0, gscene.vf.width - 1), 
                    clamp(hover.original.y +planeNormals[hover.plane].y, 0, gscene.vf.height - 1), 
                    clamp(hover.original.z+planeNormals[hover.plane].z, 0, gscene.vf.depth - 1)
                );
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
            <div className="appgl1_hover_point" style={{left:canvasRef.current?.clientWidth/2 + 'px', top: canvasRef.current?.clientHeight/2+ 'px', width: '3px', height: '3px', backgroundColor: '#0ff'}}></div>
        </div>
        <div className="appgl1_map_block">
            <div>fps: {fps.limited.toFixed(2)} / {fps.framed.toFixed(2)}</div>
        </div>
    </div>
}