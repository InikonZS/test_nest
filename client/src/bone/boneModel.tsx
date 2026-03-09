import React, { useContext, useState } from "react";

export interface IKeyFrame {
    time?: number,
    position: { x: number, y: number },
    scale? : { x: number, y: number },
    angle: number,
}

export interface IBoneNode {
    id: string,
    name: string,

    imageURL?: string,
    position: { x: number, y: number },
    width: number,
    height: number,
    angle: number,
    text?: string,
    style: 'box',
    visible?: boolean,

    keyframes: IKeyFrame[]

    objects?: Array<IBoneNode>
}

const testMock: IBoneNode = {
    id: '1',
    name: 'root',
    position: {
        x: 0,
        y: 0
    },
    width: 0,
    height: 0,
    angle: 0,
    style: "box",
    keyframes: [],
    objects: [
        {
            id: '2',
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
                    angle: 0,
                    time: 0
                },
                {
                    position: { x: 150, y: 120 },
                    angle: 0,
                    time: 400
                },
            ],
            objects: [
                {
                    id: "3",
                    name: 'box3',
                    position: { x: 340, y: 100 },
                    width: 50,
                    height: 50,
                    angle: 0,
                    text: "test1",
                    style: 'box',
                    keyframes: [],
                    objects: []
                }
            ]
        },
        {
            id: "4",
            name: 'box2',
            position: { x: 240, y: 100 },
            width: 50,
            height: 50,
            angle: 0,
            text: "test1",
            style: 'box',
            keyframes: []
        }
    ],
};

export const boneContext = React.createContext<{
    model: IBoneNode,
    history: {action: string, model: IBoneNode}[],
    setModel?: React.Dispatch<React.SetStateAction<IBoneNode>>,
    setObjectKeyframe?: (id: string, time: number, data: IKeyFrame) => void;
    activeObject: IBoneNode,
    setActiveObject: React.Dispatch<React.SetStateAction<IBoneNode>>,
}>({
    model: testMock,
    history: [],
    setModel: null,
    setObjectKeyframe: null,
    activeObject: null,
    setActiveObject: null
});

export const BoneModelProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [model, setModel] = useState<IBoneNode>(testMock);
    const [activeObject, setActiveObject] = useState<IBoneNode>(null);
    const [history, setHistory] = useState<{action: string, model: IBoneNode}[]>([{action: 'Init', model: testMock}]);

    const setObjectKeyframe = (id: string, time: number, data: IKeyFrame) => {
        const findRecursive = (item: IBoneNode, path: Array<number>) => {
            if (item.id == id) {
                return path;
            } else if (item.objects) {
                let nextPath: Array<number>;
                item.objects.some((child, childIndex) => {
                    path.push(childIndex);
                    nextPath = findRecursive(child, path);
                    if (nextPath) {
                        return true;
                    }
                    path.pop();
                })
                return nextPath;
            } else {
                return null;
            }
        }
        setModel(last => {
            const path = findRecursive(last, []);
            if (!path) {
                console.log('Wrong bone id:', id)
                return last;
            }
            let next: IBoneNode = { ...last };
            let currentObject = next;
            path.forEach((pathIndex) => {
                currentObject.objects = [...currentObject.objects];
                currentObject.objects[pathIndex] = { ...currentObject.objects[pathIndex] }
                currentObject = currentObject.objects[pathIndex];
            })
            const nextKeyframes = [...(currentObject.keyframes || [])];
            const foundFrameIndex = nextKeyframes.findIndex((frame) => {
                return frame.time == time;
            });
            if (foundFrameIndex != -1) {
                nextKeyframes[foundFrameIndex] = { ...nextKeyframes[foundFrameIndex], ...data }
            } else {
                nextKeyframes.push({ ...data, time: time });
            }
            currentObject.keyframes = nextKeyframes;
            setHistory(lastHist=>{
                const histIndex = history.findIndex(jt=>jt.model == last);
                const nextHist = [...lastHist.slice(0, histIndex + 1), {action: 'Keyframe', model:next}];
                return nextHist;
            });
            return next;
        })
    }

    return <boneContext.Provider value={{
        model,
        history,
        setModel,
        setObjectKeyframe,
        activeObject,
        setActiveObject
    }}>
        {children}
    </boneContext.Provider>
}

export const useBoneContext = () => {
    return useContext(boneContext);
}