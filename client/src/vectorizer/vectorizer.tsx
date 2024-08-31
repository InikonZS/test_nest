import React, { useEffect, useRef, useState } from "react";
import "./vectorizer.css";
import {convertByClick} from './core/main';
import { processFile } from "./core/processFile";

export function Vectorizer(){
    const [loadedImage, setLoadedImage] = useState<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>();
    const svgRef = useRef<SVGSVGElement>();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null);
    const [threshold, setThreshold] = useState(20);

    const handleFileInput = (e: React.FormEvent<HTMLInputElement>)=>{
        const input = e.target as HTMLInputElement;
        processFile(input.files[0], (image) => {
            setLoadedImage(image);
            
        });
    }

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>)=>{
        const canvas = ctx.canvas;
        const bounds = canvas.getBoundingClientRect();
        const scale = {x: bounds.width / canvas.width, y: bounds.height / canvas.height};
        const clickPos = {x: Math.floor(e.nativeEvent.offsetX / scale.x), y: Math.floor(e.nativeEvent.offsetY / scale.y)};
        const resultSvgCode = convertByClick(ctx, clickPos, loadedImage, threshold);
        svgRef.current.innerHTML += resultSvgCode;
    }

    useEffect(()=>{
        if (canvasRef.current){
            setCtx(canvasRef.current.getContext('2d'));
        }
    }, [canvasRef.current]);

    useEffect(()=>{
        if (ctx && loadedImage){
            const canvas = ctx.canvas;
            canvas.width = loadedImage.naturalWidth;
            canvas.height = loadedImage.naturalHeight;
            ctx.drawImage(loadedImage, 0, 0);
        }
    }, [loadedImage, ctx]);

    return (
        <div className="main">
            <div className="vectorizer_top">
                <input type="file" className="vectorizer_file-input" onChange={handleFileInput}/>
                <input type="range" min="1" max="255" step="1" value={threshold} className="vectorizer_threshold-input" onChange={(e)=>{
                    setThreshold(e.target.valueAsNumber)
                }}/>
            </div> 
            <div className="vectorizer_images">
                <div className="vectorizer_source">
                    <canvas ref={canvasRef} className="vectorizer_source-canvas" onClick={handleCanvasClick}></canvas>
                </div>
                <div className="vectorizer_dest">
                    <svg ref={svgRef} className="vectorizer_dest-svg" width="1000" height="1000" viewBox="0 0 1000 1000"></svg>
                </div>
            </div>
        </div>
    )
}