import { useEffect, useRef, useState } from "react"
import { curveApproximationDiff, getBisect, optimizeCurve, sampleCurve, vecScale, vecSum } from "./spline";
import React from "react";

export const SplineTest = ()=>{
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [intervalPoints, setIntervalPoints] = useState<{x: number, y: number}[]>([]);

    const points = [{x: 10, y: 30},{x: 30, y: 20},{x: 60, y: 40},{x: 70, y: 20},].map(it=>({x: it.x* 3, y: it.y*3})).reverse()
    const normals = [getBisect(points[0], points[1], points[2]),getBisect(points[1], points[2], points[3])];
    //const intervalPoints = [{x: 48, y: 25}, {x: 41, y: 35}, {x: 45, y: 30}].map(it=>({x: it.x* 3, y: it.y*3}));
    const handles = optimizeCurve(0, 0, 12, (s1, s2)=>{
        const curve = {
            p0: points[1],
            p1: vecSum(vecScale(normals[0].normal, s1), points[1]),
            p2: vecSum(vecScale(normals[1].normal, s2), points[2]),
            p3: points[2],
        }
    return curveApproximationDiff(sampleCurve(curve.p0, curve.p1, curve.p2, curve.p3, 30), intervalPoints).unsigned
    })

    useEffect(()=>{
        if (!canvasRef.current){
            return;
        }
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
    
        points.forEach(point=>{
            ctx?.fillRect(point.x, point.y, 5, 5);
        })

        intervalPoints.forEach(point=>{
            ctx?.fillRect(point.x, point.y, 5, 5);
        })

        const drawNormal = (point: {x: number, y: number}, normal: {x: number, y: number})=>{
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.x + normal.x * 30, point.y + normal.y * 30);
            ctx.stroke();
        }

        const drawBezier = (pointStart: {x: number, y: number}, normalStart: {x: number, y: number}, normalEnd: {x: number, y: number}, pointEnd: {x: number, y: number})=>{
            ctx.beginPath();
            ctx.moveTo(pointStart.x, pointStart.y);
            ctx.bezierCurveTo(
                normalStart.x * handles.s1 + pointStart.x, normalStart.y * handles.s1 + pointStart.y,
                normalEnd.x * handles.s2 + pointEnd.x, normalEnd.y * handles.s2 + pointEnd.y, 
                pointEnd.x, pointEnd.y
            );
            ctx.stroke();
        }

        drawNormal(points[1], normals[0].normal);
        drawNormal(points[2], normals[1].normal);
        drawBezier(points[1], normals[0].normal, normals[1].normal, points[2]);
    }, [intervalPoints]);

    return <div>
        <canvas ref={canvasRef} onClick={(e)=>{
            setIntervalPoints(last=>[...last, {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}])
        }}></canvas>
    </div>
}