import React, { useEffect, useRef, useState } from "react";
import { MindmapEditor } from './mindmap/editor';
import { TimeTrack } from "./components/timeTrack/TimeTrack";
import { useWheelFix } from "./useWheelFix";
import { BoneObject } from "./boneObject";
import { SceneLoader } from "./components/sceneLoader/SceneLoader";
import { LayersTree, LayersTreeEditor } from "./components/layersTree/LayersTree";
import { boneContext, BoneModelProvider, IBoneNode, useBoneContext } from "./boneModel";
import { BoneCanvas } from "./boneCanvas";
import { getCurrentTransform, getGlobalTransform } from "./utils";
import "./bone.css";
import "./boneStateGroup.css";

export const Bone = () => {
    return <BoneModelProvider>
        <BoneContent />
    </BoneModelProvider>
}

export const BoneContent = () => {
    const [playState, setPlayState] = useState(false);
    const { model, history, activeObject, setActiveObject, setModel, setObjectKeyframe, refMap } = useBoneContext();
    const [currentTransform, setCurrentTransform] = useState<any>(null)
    const [time, setTime] = useState(0);

    useWheelFix();
    useEffect(() => {
        const currentTransform = activeObject ? getCurrentTransform(activeObject, refMap) : null;
        setCurrentTransform(currentTransform);
    }, [activeObject, time]);

    return <div className="boneRoot">
        <div className="boneVerticalCenter">
            <div className="boneMain">
                <BoneCanvas refMap={refMap} time={time}>
                    {
                        model.objects.map((objectData, i) => {
                            return <BoneObject key={objectData.id}
                                onSelect={data => setActiveObject(data)}
                                objectData={objectData}
                                time={time}
                                playState={playState}
                                refMap={refMap}
                                onChange={(id, data) => {
                                    console.log(JSON.stringify(data));
                                }}
                            ></BoneObject>
                        })
                    }
                </BoneCanvas>
            </div>
            <div className="boneBottom">
                <div className="boneAnimations">
                    <div onClick={() => {
                        setPlayState(last => !last);
                    }}>{playState ? 'stop' : 'play'}</div>
                    <TimeTrack
                        onTime={(currentTime) => setTime(currentTime)}
                        model={model}
                        onChange={(model) => { }}
                    ></TimeTrack>
                </div>
            </div>
        </div>

        <div className="boneRight">
            {activeObject && currentTransform && <div className="boneObjectStates">
                {activeObject.name}
                <div className="boneObjectStateGroup">
                    <div className="boneObjectStateGroupName">
                        Translate
                    </div>
                    <div className="boneObjectStateLine">
                        <div className="boneObjectStateLineName">
                            x:
                        </div>
                        <div className="boneObjectStateLineValue">
                            {currentTransform.translate.x}
                        </div>
                    </div>
                    <div className="boneObjectStateLine">
                        <div className="boneObjectStateLineName">
                            y:
                        </div>
                        <div className="boneObjectStateLineValue">
                            {currentTransform.translate.y}
                        </div>
                    </div>
                </div>
                <div className="boneObjectStateGroup">
                    <div className="boneObjectStateGroupName">
                        Rotate
                    </div>
                    <div className="boneObjectStateLine">
                        <div className="boneObjectStateLineName">
                            angle:
                        </div>
                        <div className="boneObjectStateLineValue">
                            {currentTransform.rotate}
                        </div>
                    </div>
                </div>
                <div className="boneObjectStateGroup">
                    <div className="boneObjectStateGroupName">
                        Scale
                    </div>
                    <div className="boneObjectStateLine">
                        <div className="boneObjectStateLineName">
                            x:
                        </div>
                        <div className="boneObjectStateLineValue">
                            {currentTransform.scale.x}
                        </div>
                    </div>
                    <div className="boneObjectStateLine">
                        <div className="boneObjectStateLineName">
                            y:
                        </div>
                        <div className="boneObjectStateLineValue">
                            {currentTransform.scale.y}
                        </div>
                    </div>
                </div>
            </div>

            }
            <div className="boneHistory">
                {history.map((it, i) => {
                    const histIndex = history.findIndex(jt => jt.model == model);
                    return <div className={`boneHistoryItem ${histIndex == i ? "boneHistoryActive" : ""} ${histIndex < i ? "boneHistoryTail" : ""}`} onClick={() => setModel(it.model)}>{it.action}</div>
                })}
            </div>
            <SceneLoader onLoad={async (scene, resMap) => {
                const objects: Array<IBoneNode & { imagePath: string }> = scene.reverse().map((it: any) => {
                    return {
                        id: it.image,
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
                for (const obj of objects) {
                    if (!resMap[obj.imagePath + '.png']) {
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
                setModel(last => ({ ...last, objects: objects }));
            }}></SceneLoader>
            <div className="boneLayers">
                <LayersTreeEditor model={model} onChange={(m) => { setModel(m) }}></LayersTreeEditor>
            </div>
        </div>

    </div>
}