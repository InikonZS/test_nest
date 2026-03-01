import React, { useEffect, useState } from "react";
import { MindmapEditor } from './mindmap/editor';
import { TimeTrack } from "./components/timeTrack/TimeTrack";
import { useWheelFix } from "./useWheelFix";
import { BoneObject } from "./boneObject";
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
                ]
            }
        ]
    });
    const [time, setTime] = useState(0);
    useWheelFix();
    return <div className="boneRoot">
        <div className="boneVerticalCenter">
            <div className="boneMain">
                <div className="boneCanvas">
                    {
                        model.objects.map((objectData, i)=>{
                            return <BoneObject objectData={objectData} time={time} onChange={(data: any)=>{
                                console.log(JSON.stringify(data));
                                setModel((last)=>{
                                    const next = {...last}
                                    const foundFrameIndex = next.objects[i].keyframes.findIndex((frame, frameIndex)=>{
                                        return frame.time == time;
                                    });
                                    if (foundFrameIndex != -1){
                                        const nextKeyframes = [...next.objects[i].keyframes];
                                        //next.objects[i].keyframes[foundFrameIndex] = {...next.objects[i].keyframes[foundFrameIndex], ...data}
                                        nextKeyframes[foundFrameIndex] = {...nextKeyframes[foundFrameIndex], ...data}
                                        next.objects[i].keyframes = nextKeyframes;
                                    } else {
                                        const nextKeyframes = [...next.objects[i].keyframes];
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
            <div className="boneLayers">
                <div className="boneLayersLayer">
                    Layer name
                </div>
            </div>
        </div>

    </div>
}