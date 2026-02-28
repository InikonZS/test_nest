import React from "react";
import { MindmapEditor } from './mindmap/editor';
import { TimeTrack } from "./components/timeTrack/TimeTrack";
import { useWheelFix } from "./useWheelFix";
import "./bone.css";


export const Bone = () => {
    useWheelFix();
    return <div className="boneRoot">
        <div className="boneVerticalCenter">
            <div className="boneMain">
                <MindmapEditor data={{
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
                }} onClose={() => { }}/>
            </div>
            <div className="boneBottom">
                <div className="boneAnimations">
                      <TimeTrack></TimeTrack>
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