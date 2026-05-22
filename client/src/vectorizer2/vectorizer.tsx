import React, { useEffect, useRef, useState } from "react";
import { useWheelFix } from "./useWheelFix";
import { FileImageInput } from "./components/fileInput/fileInput";
import { getBounds, getPoly, optimizePolyDynamic, toBitmap, toClipPolygon } from "./core";
import { toClipPath } from "./spline";
import { SplineTest } from "./spliteTest";
import style from "./vectorizer.m.css";

export const Vectorizer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const previewSVGRef = useRef<SVGSVGElement>(null);
    const previewBoundRef = useRef<HTMLDivElement>(null);
    const [sourceImage, setSourceImage] = useState<HTMLImageElement>(null);
    const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number }>(null);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>(null);
    const [val1, setVal1] = useState(15);
    const [val2, setVal2] = useState(30);
    const [generatedPath, setGeneratedPath] = useState<Array<number>>(null);
    const [fullPoly, setFullPoly] = useState<Array<{ x: number, y: number }>>();
    const [pathCurve, setPathCurve] = useState<{d: string, box: string}>({d: '', box: ''});

    useEffect(() => {
        if (!canvasRef.current) { return; }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        setCanvasContext(ctx);
    }, []);

    useEffect(() => {
        if (!sourceImage) { return; }
        if (!canvasContext) { return; }

        const canvas = canvasContext.canvas;
        canvas.width = sourceImage.naturalWidth;
        canvas.height = sourceImage.naturalHeight;
        const ctx = canvasContext
        ctx.drawImage(sourceImage, 0, 0);
    }, [sourceImage, canvasContext]);

    useEffect(() => {
        if (!sourceImage) { return; }
        if (!canvasContext) { return; }
        if (!selectedPoint) { return; }

        const presize = 1;
        const size = 1;
        const { bitmap: btm, color } = toBitmap(sourceImage, selectedPoint, presize, 60);
        const poly1 = getPoly(btm, selectedPoint).map(it => ({ x: it.x / presize, y: it.y / presize }));
        console.log(poly1);
        setFullPoly(poly1);
        //const optimized = optimizePolySoft1(optimizePolyHard(poly1));
        //const optimized = optimizePolySoft(poly1);
        //const optimized = optimizePolyDynamic(optimizePolyDynamic(poly1));
        const upd = (val: number, val2: number) => {
            const optimized = optimizePolyDynamic(poly1, val, val2);
            //const optimized = optimizePolyDynamic(optimizePolyDynamic(poly1, val, val2), val, val2);
            const hitarea: Array<number> = [];
            optimized.forEach(it => {
                hitarea.push(it.x);
                hitarea.push(it.y);
            })
            console.log(optimized);
            console.log('hitarea', hitarea)
            const ctx = canvasContext;
            const img = sourceImage;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(img, 0, 0, img.naturalWidth * size, img.naturalHeight * size);
            ctx.beginPath();
            ctx.strokeStyle = '#f00';
            optimized.forEach((it, i) => {
                if (i == 0) {
                    ctx.moveTo(optimized[optimized.length - 1].x * size, optimized[optimized.length - 1].y * size)
                    ctx.lineTo(it.x * size, it.y * size)
                } else {
                    ctx.lineTo(it.x * size, it.y * size)
                }
            })
            //ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#f90';
            optimized.forEach((it, i) => {
                ctx.fillRect(it.x * size - 1.5, it.y * size - 1.5, 3, 3)
            })

            setGeneratedPath(hitarea);
        }
        upd(val1, val2);


        /*inp1.oninput = () => {
            upd(inp1.value, inp2.value);
        }
        inp2.oninput = () => {
            upd(inp1.value, inp2.value);
        }*/
    }, [sourceImage, canvasContext, selectedPoint, val1, val2]);

    useEffect(()=>{
        if (!generatedPath){
            previewRef.current.style.clipPath = '';
            return;
        }
        const pathPolygon = toClipPolygon(generatedPath);
        previewRef.current.style.clipPath = pathPolygon;
        const areaBounds = getBounds(generatedPath);
        previewRef.current.style.aspectRatio = (areaBounds.width / areaBounds.height).toString();
    }, [generatedPath]);

    useEffect(()=>{
        if (!generatedPath){
            previewSVGRef.current.style.clipPath = '';
            return;
        }
        const pathCurve = toClipPath(generatedPath, fullPoly);
        //previewSVGRef.current.style.clipPath = pathCurve;
        const areaBounds = getBounds(generatedPath);
        setPathCurve({d: pathCurve, box: `${areaBounds.minX} ${areaBounds.minY} ${areaBounds.width} ${areaBounds.height}`});
        //setPathCurve({d: pathCurve, box: `${0} ${0} ${areaBounds.width} ${areaBounds.height}`});
        //previewSVGRef.current.style.aspectRatio = (areaBounds.width / areaBounds.height).toString();
    }, [generatedPath]);

    useEffect(() => {
        if (!generatedPath){
            return;
        }
        const resizeBounds = () => {
            const boundsParent = previewRef.current.parentElement.getBoundingClientRect();
            const widthParent = boundsParent.width;
            const heightParent = boundsParent.height;
            
            const areaBounds = getBounds(generatedPath);
            const width = areaBounds.width;
            const height = areaBounds.height;

            const aspect = height / width;
            const size = Math.min(heightParent / aspect, widthParent);
            previewRef.current.style.width = `${size}px`;
            previewRef.current.style.height = `${aspect * size}px`;
            previewSVGRef.current.style.width = `${size}px`;
            previewSVGRef.current.style.height = `${aspect * size}px`;
            previewBoundRef.current.style.width = `${size}px`;
            previewBoundRef.current.style.height = `${aspect * size}px`;
        }

        const resize = ()=>{
            resizeBounds();
            requestAnimationFrame(()=>resizeBounds());
        }
        window.addEventListener('resize', resize);
        resize();
        
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [generatedPath]);

    useEffect(() => {
        const resizeBounds = () => {
            const boundsParent = canvasRef.current.parentElement.getBoundingClientRect();
            const widthParent = boundsParent.width;
            const heightParent = boundsParent.height;
            
            const width = canvasRef.current.width;
            const height = canvasRef.current.height;

            const aspect = height / width;
            const size = Math.min(heightParent / aspect, widthParent);
            canvasRef.current.style.width = `${size}px`;
            canvasRef.current.style.height = `${aspect * size}px`;
        }

        const resize = ()=>{
            resizeBounds();
            requestAnimationFrame(()=>resizeBounds());
        }
        window.addEventListener('resize', resize);
        resize();
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [sourceImage]);

    useWheelFix();

    return <div className={style.root}>
        <div className={style.top}>
            <FileImageInput onLoad={(image) => {
                setSelectedPoint(null);
                setSourceImage(image);
            }} />
            <input type="range" value={val1} min={1} max={72} onChange={(e) => {
                setVal1(e.target.valueAsNumber)
            }} />
            <input type="range" value={val2} min={1} max={72} onChange={(e) => {
                setVal2(e.target.valueAsNumber)
            }} />
        </div>
        <div className={style.main}>
            <div className={style.mainHalf}>
                <canvas ref={canvasRef} className={style.canvas} onClick={(e) => {
                    const bounds = canvasRef.current.getBoundingClientRect();
                    const size = bounds.width / canvasRef.current.width;
                    console.log('sz', size, { x: Math.floor(e.nativeEvent.offsetX / size), y: Math.floor(e.nativeEvent.offsetY / size) })
                    setSelectedPoint({ x: Math.floor(e.nativeEvent.offsetX / size), y: Math.floor(e.nativeEvent.offsetY / size) });
                }} />
            </div>
            <div className={style.mainHalf}>
                {<div ref={previewBoundRef} className={style.previewBound}></div>}
                <div ref={previewRef} className={style.preview}></div>
                <svg ref={previewSVGRef} style={{position: 'absolute', width: '100%', opacity: 0.5}} viewBox={pathCurve.box}>
                    <path d={pathCurve.d} fill="#000000"></path>
                </svg>
                {/* <SplineTest></SplineTest> */}
            </div>
        </div>
    </div>
}