import React, { useEffect, useState } from "react";
import { MindmapEditor } from './mindmap/editor';
import { TimeTrack } from "./components/timeTrack/TimeTrack";
import { useWheelFix } from "./useWheelFix";
import { BoneObject } from "./boneObject";
import { SceneLoader } from "./components/sceneLoader/SceneLoader";
import { LayersTree, LayersTreeEditor } from "./components/layersTree/LayersTree";
import "./bone.css";


export const Bone = () => {
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
                <div className="boneCanvas">
                    <div className="boneCamera">
                    {
                        model.objects.map((objectData, i)=>{
                            return <BoneObject objectData={objectData} time={time} onChange={(data: any)=>{
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
                      <TimeTrack onTime = {(currentTime)=>setTime(currentTime)} model={model}></TimeTrack>
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