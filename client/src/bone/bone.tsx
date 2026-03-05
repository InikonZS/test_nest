import React, { useEffect, useRef, useState } from "react";
import { MindmapEditor } from './mindmap/editor';
import { TimeTrack } from "./components/timeTrack/TimeTrack";
import { useWheelFix } from "./useWheelFix";
import { BoneObject } from "./boneObject";
import { SceneLoader } from "./components/sceneLoader/SceneLoader";
import { LayersTree, LayersTreeEditor } from "./components/layersTree/LayersTree";
import "./bone.css";
import { getGlobalTransform } from "./utils";


export const Bone = () => {
    const cameraRef = useRef<HTMLDivElement>();
    const refMap = useRef<Record<string, HTMLDivElement>>({});
    const [model, setModel] = useState({
        id: '1',
        name: 'Dashboard',
        objects: [
            {
                name: 'box1',
                position: { x: 100, y: 100 },
                width: 100,
                height: 150,
                angle: 0,
                text: "test1",
                style: 'box',
                keyframes: [
                    {
                        position: { x: 100, y: 100 },
                        time: 0
                    },
                    {
                        position: { x: 150, y: 120 },
                        time: 400
                    },
                ],
                objects: [
                     {
                        name: 'box3',
                        position: { x: 340, y: 100 },
                        width: 50,
                        height: 50,
                        angle: 0,
                        text: "test1",
                        style: 'box',
                        keyframes: []
                    }
                ]
            },
            {
                name: 'box2',
                position: { x: 240, y: 100 },
                width: 50,
                height: 50,
                angle: 0,
                text: "test1",
                style: 'box',
                keyframes: []
            }
        ]
    });
    const [time, setTime] = useState(0);
    useWheelFix();
    return <div className="boneRoot">
        <div className="boneVerticalCenter">
            <div className="boneMain">
                <div className="boneCanvas" onMouseMove={(e)=>{
                    //console.log(e);
                    //getGlobalTransform()
                    const hoverList = model.objects.filter((it, i)=>{
                        //if (i !=0 ) return;
                        if (!refMap.current[it.name]) return;
                        const objectTransform = new DOMMatrix(getComputedStyle(refMap.current[it.name]).transform).translate(it.width / 2, it.height/2)//new DOMMatrix().translate(it.position.x, it.position.y).translate(it.width / 2, it.height/2);
                        const cameraBounds = cameraRef.current.parentElement.getBoundingClientRect();
                        const cameraTransform = getGlobalTransform(cameraRef.current)// new DOMMatrix().translate(cameraBounds.left, cameraBounds.top);
                        const worldTransform = cameraTransform.multiply(objectTransform);//.translate(it.width / 2 + cameraBounds.width/2, it.height/2 + cameraBounds.height/2);
                        //console.log(cameraTransform)
                       // const localPoint = cameraTransform.inverse().transformPoint(new DOMPoint(e.clientX + cameraBounds.left, e.clientY - cameraBounds.top))//cameraTransform.inverse().translate(- cameraBounds.width/2, -cameraBounds.height/2).transformPoint(new DOMPoint(e.clientX, e.clientY));
                       const trans = new DOMMatrix().translate( - cameraBounds.left - cameraBounds.width / 2,  - cameraBounds.top - cameraBounds.height / 2);
                       const trans2 = new DOMMatrix().translate( cameraBounds.width / 2,  cameraBounds.height / 2);
                       //console.log(cameraTransform.multiply(trans))
                       let localPoint = trans2.multiply(cameraTransform.inverse().multiply(trans))/*.multiply(cameraTransform)*/.transformPoint(new DOMPoint(e.clientX, e.clientY))//(new DOMPoint(e.clientX - cameraBounds.left - 0*cameraBounds.width / 2, e.clientY - cameraBounds.top - 0*cameraBounds.height / 2)) 
                       localPoint = objectTransform.inverse().transformPoint(localPoint);
                       //console.log(localPoint, new DOMPoint(e.clientX - cameraBounds.left - cameraBounds.width / 2, e.clientY - cameraBounds.top - cameraBounds.height / 2));
                       //console.log(cameraTransform.multiply(objectTransform).inverse().transformPoint(new DOMPoint(e.clientX + cameraBounds.left - cameraBounds.width / 2, e.clientY - cameraBounds.top - cameraBounds.height / 2)))
                       //console.log(worldTransform.inverse().transformPoint(localPoint))
                        return (Math.abs(localPoint.x) <= it.width/2 && Math.abs(localPoint.y) <= it.height/2)
                    });
                    console.log(hoverList)
                }}>
                    <div className="boneCamera" ref={cameraRef}>
                    {
                        model.objects.map((objectData, i)=>{
                            return <BoneObject objectData={objectData} time={time} refMap={refMap} onChange={(data: any)=>{
                                console.log(JSON.stringify(data));
                                setModel((last)=>{
                                    const next = {...last}
                                    const foundFrameIndex = (next.objects[i].keyframes || []).findIndex((frame, frameIndex)=>{
                                        return frame.time == time;
                                    });
                                    if (foundFrameIndex != -1){
                                        const nextKeyframes = [...(next.objects[i].keyframes || [])];
                                        //next.objects[i].keyframes[foundFrameIndex] = {...next.objects[i].keyframes[foundFrameIndex], ...data}
                                        nextKeyframes[foundFrameIndex] = {...nextKeyframes[foundFrameIndex], ...data}
                                        next.objects[i].keyframes = nextKeyframes;
                                    } else {
                                        const nextKeyframes = [...(next.objects[i].keyframes || [])];
                                        nextKeyframes.push({...data, time: time});
                                        next.objects[i].keyframes = nextKeyframes;
                                    }
                                    console.log(next);
                                    return next;
                                })
                            }}></BoneObject>
                        })
                    }
                    </div>
                </div>
                {/* <MindmapEditor data={{
                    id: '1',
                    name: 'Dashboard',
                    objects: [
                        {
                            position: { x: 100, y: 100 },
                            width: 100,
                            height: 150,
                            angle: 0,
                            text: "test1",
                            style: 'box'
                        }
                    ]
                }} onClose={() => { }}/> */}
            </div>
            <div className="boneBottom">
                <div className="boneAnimations">
                      <TimeTrack onTime = {(currentTime)=>setTime(currentTime)} model={model} onChange={(model)=>setModel(model)}></TimeTrack>
                    {/* <div className="boneAnimationsTimeline">
                        <TimeTrack></TimeTrack>
                    </div>
                    <div className="boneAnimationsList">
                        <div className="boneAnimationsItem">
                            <div className="boneAnimationsItemName">
                                Track 1
                            </div>
                            <div className="boneAnimationsItemTrack">

                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>

        <div className="boneRight">
            <SceneLoader onLoad={async (scene, resMap)=>{
                const objects: Array<any> = scene.reverse().map((it: any)=>{
                    return {
                        name: it.image,
                        imagePath: it.image,
                        position: { x: it.position.x, y: it.position.y },
                        width: 0,
                        height: 0,
                        angle: 0,
                        text: "",
                        style: 'box',
                    }
                });
                for( const obj of objects){
                    if (!resMap[obj.imagePath + '.png']){
                        continue;
                    }
                    const bitmap = await createImageBitmap(resMap[obj.imagePath + '.png']);
                    const size = {
                        width: bitmap.width,
                        height: bitmap.height
                    };
                    obj.width = size.width;
                    obj.height = size.height;
                    obj.position.x = obj.position.x - size.width / 2;
                    obj.position.y = obj.position.y - size.height / 2;
                    obj.imageURL = URL.createObjectURL(resMap[obj.imagePath + '.png']);
                    bitmap.close();
                }
                setModel(last=> ({...last, objects: objects}));
            }}></SceneLoader>
            <div className="boneLayers">
                {/* <div className="boneLayersLayer">
                    Layer name
                </div> */}
                <LayersTreeEditor model={model} onChange={(m)=>{setModel(m)}}></LayersTreeEditor>
            </div>
        </div>

    </div>
}