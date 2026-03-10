import { useContext, useEffect, useRef, useState } from "react";
import { IBoneNode, useBoneContext } from "./boneModel";
import { getCurrentTransform as _getCurrentTransform, getGlobalTransform, getGlobalTransform2 } from "./utils";
import React from "react";
import { RotationMarker } from "./components/dragStick/dragStick";
import "./boneCanvas.css";

const canvasContext = React.createContext<{
    getLocalCursor: (it: IBoneNode, pos: {x: number, y: number})=>{x: number, y: number},
    dragStart: React.MouseEvent<Element, MouseEvent>, setDragStart: React.Dispatch<React.SetStateAction<React.MouseEvent<Element, MouseEvent>>>,
    temp: { position: { x: number, y: number }, angle: number, scale: {x:number, y:number} }, 
    setTemp: React.Dispatch<React.SetStateAction<{
    position: {
        x: number;
        y: number;
    };
    angle: number;
    scale: {
        x: number;
        y: number;
    };
}>>
}>({
    getLocalCursor: null,
    dragStart: null, 
    setDragStart: null,
    temp: null, 
    setTemp: null
});

export const useCanvasContext = ()=>useContext(canvasContext);

export const BoneCanvas = ({children, refMap, time}: React.PropsWithChildren<{refMap: any, time: number}>) => {
    const cameraRef = useRef<HTMLDivElement>();
    const viewRef = useRef<HTMLDivElement>();
        const [dragStart, setDragStart] = useState<React.MouseEvent>(null);
        const [temp, setTemp] = useState({ position: { x: 0, y: 0 }, angle: 0, scale: {x:1, y:1} })
    //const refMap = useRef<Record<string, HTMLDivElement>>({});
    const {model, setModel, activeObject, setObjectKeyframe} = useBoneContext();
    const [cameraData, setCameraData] = useState({
        scale: 0.5,
        position: {x: 0, y: 0}
    });

    const getCurrentTransform = ()=>_getCurrentTransform(activeObject, refMap);
      useEffect(() => {
            if (!dragStart) {
                return;
            }
            let lastPosX = dragStart.clientX;
            let lastPosY = dragStart.clientY;
            dragStart.stopPropagation();
            const matrix = getGlobalTransform(refMap.current[activeObject?.name].parentElement.parentElement);
            const moveHandler = (moveEvent: MouseEvent) => {
                const dx = moveEvent.clientX - lastPosX;
                const dy = moveEvent.clientY - lastPosY;
                lastPosX = moveEvent.clientX;
                lastPosY = moveEvent.clientY;
                setTemp(last => {
                    const globalPos = matrix.transformPoint(new DOMPoint(last.position.x, last.position.y));
                    const localPos = matrix.inverse().transformPoint(new DOMPoint(globalPos.x + dx, globalPos.y + dy));
                    return {
                        position: {
                            x: localPos.x,
                            y: localPos.y,
                        },
                        angle: last.angle,
                        scale: {
                            x: last.scale?.x ?? 1,
                            y: last.scale?.y ?? 1
                        }
                    }
                })
            }
            window.addEventListener('mousemove', moveHandler);
            return () => {
                window.removeEventListener('mousemove', moveHandler);
            }
        }, [dragStart, model, activeObject]);
    
        useEffect(() => {
            const upHandler = (moveEvent: MouseEvent) => {
                setDragStart(null);
                if (temp.position.x == 0 && temp.position.y == 0 && temp.angle == 0 && temp.scale.x == 1 && temp.scale.y == 1) {
                    return;
                }
                const point = {
                    x: getCurrentTransform().translate.x + temp.position.x,
                    y: getCurrentTransform().translate.y + temp.position.y
                }
                const currentTransform = getCurrentTransform();
                const data = {
                    position: {
                        x: point.x,
                        y: point.y
                    },
                    angle: temp.angle + currentTransform.rotate,
                    scale: {
                        x: getCurrentTransform().scale.x * temp.scale.x,
                        y: getCurrentTransform().scale.y * temp.scale.y
                    }
                }
                setObjectKeyframe(activeObject.id, time, data)
                setTemp({ position: { x: 0, y: 0 }, angle: 0, scale: {x: 1, y: 1} });
            }
            window.addEventListener('mouseup', upHandler);
            return () => {
                window.removeEventListener('mouseup', upHandler);
            }
        }, [dragStart, temp, model, activeObject])


           const handleMarkerSize = (downEvent: React.MouseEvent, setter: (value: any, moveEvent: MouseEvent) => any) => {
                downEvent.stopPropagation();
                console.log('down marker')
                const moveHandler = (moveEvent: MouseEvent) => {
                    setTemp(last => {
                        return setter(last, moveEvent)
                    });
                    /*setObjects(last=>{
                        return setter(last, moveEvent)
                    });*/
                }
                const upHandler = (moveEvent: MouseEvent) => {
                    window.removeEventListener('mousemove', moveHandler);
                    window.removeEventListener('mouseup', upHandler);
                }
                window.addEventListener('mousemove', moveHandler);
                window.addEventListener('mouseup', upHandler);
            }
        


    useEffect(()=>{
        if (!viewRef.current){
            return;
        }
        const handler = (e: WheelEvent) => {
        if (e.ctrlKey) {
            const rect = viewRef.current.getBoundingClientRect();
            const mouse = {
                x: e.clientX - rect.left - rect.width /2,
                y: e.clientY - rect.top - rect.height /2
            };
            
            const scaleChange = 1 - e.deltaY * 0.01;
            //console.log("pinch trackpad scale:", scaleChange);
            setCameraData(last=>{
                            const newPos = {
                x: mouse.x - (mouse.x - last.position.x) * scaleChange,
                y: mouse.y - (mouse.y - last.position.y) * scaleChange
            };
                return {...last, scale: last.scale * scaleChange, position: newPos}
            })
            e.preventDefault();
        } else {
            //console.log("trackpad scroll:", e.deltaY, e.deltaX);
            setCameraData(last=>{
                return {...last, position: {x: last.position.x - e.deltaX, y: last.position.y - e.deltaY}}
            })
            e.preventDefault();
        }
        }
        viewRef.current.addEventListener("wheel", handler, { passive: false });
        return ()=>{
            if (!viewRef.current){
                return;
            }
            viewRef.current.removeEventListener("wheel", handler);
        }
    }, []);

    const getWorldFromLocal = (
        el: HTMLElement,
        localPos: { x: number; y: number }
    ): { x: number; y: number } | undefined => {
        if (!el) return;
        const objectTransform = getGlobalTransform2(viewRef.current).inverse().multiply(getGlobalTransform2(el));
        return objectTransform.transformPoint(new DOMPoint(localPos.x, localPos.y))
    }

    const centerPos = getWorldFromLocal(refMap.current[activeObject?.name]?.children[0], {x:activeObject?.width/2, y:activeObject?.height/2}) || {x:0, y:0}
    const rotatePos = getWorldFromLocal(refMap.current[activeObject?.name]?.children[0], {x:activeObject?.width/2, y:0}) || {x:0, y:0}    
    const scalePos = getWorldFromLocal(refMap.current[activeObject?.name]?.children[0], {x:activeObject?.width, y:0}) || {x:0, y:0}   
    
    const getLocalCursor = (it: IBoneNode, pos: {x: number, y: number})=>{
         //if (i !=0 ) return;
            if (!refMap.current[it.name]) return;
            const objectTransform = new DOMMatrix(getComputedStyle(refMap.current[it.name]).transform).translate(it.width / 2, it.height / 2)//new DOMMatrix().translate(it.position.x, it.position.y).translate(it.width / 2, it.height/2);
            const cameraBounds = cameraRef.current.parentElement.getBoundingClientRect();
            const cameraTransform = getGlobalTransform(cameraRef.current)// new DOMMatrix().translate(cameraBounds.left, cameraBounds.top);
            const worldTransform = cameraTransform.multiply(objectTransform);//.translate(it.width / 2 + cameraBounds.width/2, it.height/2 + cameraBounds.height/2);
            //console.log(cameraTransform)
            // const localPoint = cameraTransform.inverse().transformPoint(new DOMPoint(e.clientX + cameraBounds.left, e.clientY - cameraBounds.top))//cameraTransform.inverse().translate(- cameraBounds.width/2, -cameraBounds.height/2).transformPoint(new DOMPoint(e.clientX, e.clientY));
            const trans = new DOMMatrix().translate(- cameraBounds.left - cameraBounds.width / 2, - cameraBounds.top - cameraBounds.height / 2);
            const trans2 = new DOMMatrix().translate(cameraBounds.width / 2, cameraBounds.height / 2);
            //console.log(cameraTransform.multiply(trans))
            let localPoint = trans2.multiply(cameraTransform.inverse().multiply(trans))/*.multiply(cameraTransform)*/.transformPoint(new DOMPoint(pos.x, pos.y))//(new DOMPoint(e.clientX - cameraBounds.left - 0*cameraBounds.width / 2, e.clientY - cameraBounds.top - 0*cameraBounds.height / 2)) 
            localPoint = objectTransform.inverse().transformPoint(localPoint);
            //console.log(localPoint, new DOMPoint(e.clientX - cameraBounds.left - cameraBounds.width / 2, e.clientY - cameraBounds.top - cameraBounds.height / 2));
            //console.log(cameraTransform.multiply(objectTransform).inverse().transformPoint(new DOMPoint(e.clientX + cameraBounds.left - cameraBounds.width / 2, e.clientY - cameraBounds.top - cameraBounds.height / 2)))
            //console.log(worldTransform.inverse().transformPoint(localPoint))
            return localPoint;//(Math.abs(localPoint.x) <= it.width / 2 && Math.abs(localPoint.y) <= it.height / 2)
    }

    return <canvasContext.Provider value={{getLocalCursor: getLocalCursor, dragStart, setDragStart, temp, setTemp}}><div ref={viewRef} className="boneCanvas" onMouseMove={(e) => {
        //console.log(e);
        //getGlobalTransform()
        
        const hoverList = model.objects.filter((it, i) => {
            //if (i !=0 ) return;
            if (!refMap.current[it.name]) return;
            const objectTransform = new DOMMatrix(getComputedStyle(refMap.current[it.name]).transform).translate(it.width / 2, it.height / 2)//new DOMMatrix().translate(it.position.x, it.position.y).translate(it.width / 2, it.height/2);
            const cameraBounds = cameraRef.current.parentElement.getBoundingClientRect();
            const cameraTransform = getGlobalTransform(cameraRef.current)// new DOMMatrix().translate(cameraBounds.left, cameraBounds.top);
            const worldTransform = cameraTransform.multiply(objectTransform);//.translate(it.width / 2 + cameraBounds.width/2, it.height/2 + cameraBounds.height/2);
            //console.log(cameraTransform)
            // const localPoint = cameraTransform.inverse().transformPoint(new DOMPoint(e.clientX + cameraBounds.left, e.clientY - cameraBounds.top))//cameraTransform.inverse().translate(- cameraBounds.width/2, -cameraBounds.height/2).transformPoint(new DOMPoint(e.clientX, e.clientY));
            const trans = new DOMMatrix().translate(- cameraBounds.left - cameraBounds.width / 2, - cameraBounds.top - cameraBounds.height / 2);
            const trans2 = new DOMMatrix().translate(cameraBounds.width / 2, cameraBounds.height / 2);
            //console.log(cameraTransform.multiply(trans))
            let localPoint = trans2.multiply(cameraTransform.inverse().multiply(trans))/*.multiply(cameraTransform)*/.transformPoint(new DOMPoint(e.clientX, e.clientY))//(new DOMPoint(e.clientX - cameraBounds.left - 0*cameraBounds.width / 2, e.clientY - cameraBounds.top - 0*cameraBounds.height / 2)) 
            localPoint = objectTransform.inverse().transformPoint(localPoint);
            //console.log(localPoint, new DOMPoint(e.clientX - cameraBounds.left - cameraBounds.width / 2, e.clientY - cameraBounds.top - cameraBounds.height / 2));
            //console.log(cameraTransform.multiply(objectTransform).inverse().transformPoint(new DOMPoint(e.clientX + cameraBounds.left - cameraBounds.width / 2, e.clientY - cameraBounds.top - cameraBounds.height / 2)))
            //console.log(worldTransform.inverse().transformPoint(localPoint))
            return (Math.abs(localPoint.x) <= it.width / 2 && Math.abs(localPoint.y) <= it.height / 2)
        });
        //console.log(hoverList)
    }}>
        <div className="boneCamera" ref={cameraRef} style={{
            transform: `translate(${cameraData.position.x}px, ${cameraData.position.y}px) scale(${cameraData.scale})`
        }}>
            {children}
        </div>
        {activeObject && <div className="boneMarkers">
            <RotationMarker className="boneMarkersRotate"  style={{
                left: (rotatePos.x /*+ cameraRef.current.getBoundingClientRect().width * cameraData.scale*/)  + 'px',
                top: (rotatePos.y /*+ cameraRef.current.getBoundingClientRect().height * cameraData.scale*/)  + 'px'
            }}></RotationMarker>
            {false && `<div className="boneMarkersRotate"  style={{
                left: (rotatePos.x /*+ cameraRef.current.getBoundingClientRect().width * cameraData.scale*/)  + 'px',
                top: (rotatePos.y /*+ cameraRef.current.getBoundingClientRect().height * cameraData.scale*/)  + 'px'
            }} onDragStart={(e) => e.preventDefault()}
            onMouseDown={(downEvent) => {
                                    //downEvent.stopPropagation();
                                    //const it = objectData;
                                    /*const m = new DOMMatrix(getComputedStyle(ref.current).transform);
                                    const rotation = Math.atan2(m.b, m.a);
                                    const scaleX = Math.hypot(m.a, m.b);
                                    const scaleY = Math.hypot(m.c, m.d);*/
                                    const trs = getCurrentTransform();
                                    console.log(trs.rotate)
                                    const objectData =activeObject;
                                    const it = {
                                        //angle: rotation / Math.PI * 180,
                                        //position: {x: m.m41, y: m.m42},
                                        angle: trs.rotate,
                                        position: trs.translate,
                                        width: objectData.width,
                                        height: objectData.height
                                    }
                                    console.log(objectData);
                                    const ang = it.angle / 180 * Math.PI;
                                    /*const startPoint = {
                                        x: (it.position.x + it.width / 2) + Math.sin(ang) * (it.height / 2),
                                        y: (it.position.y + it.height / 2) - Math.cos(ang) * (it.height / 2)
                                    }
                                    const centerPoint = {
                                        x: it.position.x + it.width / 2,
                                        y: it.position.y + it.height / 2
                                    }*/
            
                                    const startPoint = {
                                        x: (it.width / 2) + Math.sin(ang) * (it.height / 2) * trs.scale.y,
                                        y: (it.height / 2) - Math.cos(ang) * (it.height / 2) * trs.scale.y
                                    }
                                    const centerPoint = {
                                        x: it.width / 2,
                                        y: it.height / 2
                                    }
            
                                    const lastAng = (it.angle + 3600000 + 180) % 360 - 180;
                                    //setCursorPoint(startPoint);
                                    let lastInputAngle = 0;
                                    let sumAngle = 0;
                                    //let startMove = getLocalCursor(objectData, { x: downEvent.clientX, y: downEvent.clientY })
            
                                    let lastPosX = downEvent.clientX;
                                    let lastPosY = downEvent.clientY;
                                    //dragStart.stopPropagation();
                                    const tempRef = {current: refMap.current[objectData?.name].parentElement};
                                    const matrix = getGlobalTransform(tempRef.current.parentElement);
                                    //const moveHandler = (moveEvent: MouseEvent) => {
            
                                    //console.log(dx, tempRef.current.style.left);
                                    //setTemp(last => {
                                    handleMarkerSize(downEvent, (last, moveEvent) => {
                                        const dx = moveEvent.clientX - lastPosX;
                                        const dy = moveEvent.clientY - lastPosY;
                                        lastPosX = moveEvent.clientX;
                                        lastPosY = moveEvent.clientY;
                                        const globalPos = matrix.transformPoint(new DOMPoint(startPoint.x, startPoint.y));
                                        const localPos = matrix.inverse().transformPoint(new DOMPoint(globalPos.x + dx, globalPos.y + dy));
            
                                        //const currentMove = getLocalCursor(objectData, { x: moveEvent.clientX, y: moveEvent.clientY })
                                        //console.log(startPoint, last.angle, it.angle);
                                        //startPoint.x += currentMove.x - startMove.x;//moveEvent.movementX;
                                        //startPoint.y += currentMove.y - startMove.y;//moveEvent.movementY;
                                        //startMove = currentMove;
                                        //startPoint.x += moveEvent.movementX * 3;
                                        //startPoint.y += moveEvent.movementY * 3;
                                        startPoint.x = localPos.x
                                        startPoint.y = localPos.y
                                        const next = { ...last };
                                        //console.log(Math.sin(next[i].angle / 180 * Math.PI) + Math.cos(next[i].angle / 180 * Math.PI), );
                                        const inputAngle = Math.atan2(startPoint.x - centerPoint.x, -(startPoint.y - centerPoint.y)) / Math.PI * 180 //- it.angle;
                                        const diff1 = inputAngle - lastInputAngle;
                                        const diff2 = inputAngle - lastInputAngle + 360;
                                        const diff3 = inputAngle - lastInputAngle - 360;
                                        const difs = [
                                            { abs: Math.abs(diff1), val: diff1 },
                                            { abs: Math.abs(diff2), val: diff2 },
                                            { abs: Math.abs(diff3), val: diff3 },
                                        ];
                                        difs.sort((a, b) => a.abs - b.abs);
                                        const minInputDiff = difs[0].val;
                                        lastInputAngle = inputAngle;
                                        //const difAng2 = next.angle - lastAng;
                                        // Приводим разницу к [-180, 180]
                                        // Новый угол, максимально близкий к oldAngle
                                        //const nextAngle1 = inputAngle - it.angle
                                        //const nextAngle2 = inputAngle - it.angle + 360;
                                        //next.angle = inputAngle - it.angle//last.angle + minInputDiff//Math.abs(nextAngle1 - last.angle) < Math.abs(nextAngle2 - last.angle) ? nextAngle1 : nextAngle2;
                                        sumAngle = sumAngle + minInputDiff;
                                        next.angle = sumAngle - lastAng;
                                        //console.log(sumAngle, lastAng, next.angle);
                                        //console.log(sumAngle)
                                        //next[i].position.x += Math.cos(difAng) * moveEvent.movementY + Math.sin(difAng) * moveEvent.movementX;
                                        //next[i].position.y += Math.cos(difAng) * moveEvent.movementX - Math.sin(difAng) * moveEvent.movementY;
                                        return next
                                    })
                                }}>
            
            </div>`}
            <div className="boneMarkersScale" style={{
                left: (scalePos.x /*+ cameraRef.current.getBoundingClientRect().width * cameraData.scale*/)  + 'px',
                top: (scalePos.y /*+ cameraRef.current.getBoundingClientRect().height * cameraData.scale*/)  + 'px'
            }} onDragStart={(e) => e.preventDefault()}  onMouseDown={(downEvent) => {
                                    downEvent.stopPropagation();
                                    const trs = getCurrentTransform();
                                    console.log(trs.rotate)
                                      const objectData =activeObject;
                                    const it = {
                                        //angle: rotation / Math.PI * 180,
                                        //position: {x: m.m41, y: m.m42},
                                        angle: trs.rotate,
                                        position: trs.translate,
                                        scale: trs.scale,
                                        width: objectData.width,
                                        height: objectData.height
                                    }
                                    //console.log(it);
                                    //const ang = it.angle / 180 * Math.PI;
                                    let lastPosX = downEvent.clientX;
                                    let lastPosY = downEvent.clientY;
                                    //dragStart.stopPropagation();
                                    const scaleRef = {current: refMap.current[objectData?.name].children[0]};
                                    const matrix = getGlobalTransform(scaleRef.current.parentElement);
                                    const ang = it.angle / 180 * Math.PI;
                                    //console.log('ang', ang)
                                    const startPoint = {
                                        x: (it.width / 1), //+ Math.sin(ang) * (it.height / 2)  + Math.cos(ang) * (it.width / 2) ,
                                        y: -(it.height / 1)// - Math.cos(ang) * (it.height / 2)  + Math.sin(ang) * (it.width / 2) 
                                        //x: (it.width),// * Math.sin(ang), //* (it.height / 2),
                                        //y: (it.height)// * Math.cos(ang)// * (it.height / 2)
                                    }
                                    const centerPoint = {
                                        x: it.width / 2,
                                        y: it.height / 2
                                    }
            
                                    handleMarkerSize(downEvent, (last, moveEvent) => {
                                        const next = {...last, scale: {...last.scale}};
                                        const dx = moveEvent.clientX - lastPosX;
                                        const dy = moveEvent.clientY - lastPosY;
                                        lastPosX = moveEvent.clientX;
                                        lastPosY = moveEvent.clientY;
                                        const globalPos = matrix.transformPoint(new DOMPoint(startPoint.x, startPoint.y));
                                        const localPos = matrix.inverse().transformPoint(new DOMPoint(globalPos.x + dx/* * Math.cos(ang) + dy * Math.sin(ang)*/ , globalPos.y/* + dx * Math.sin(ang)*/ + dy/* * Math.cos(ang) */));
                                        startPoint.x = localPos.x,
                                        startPoint.y = localPos.y
            
                                        next.scale.x = startPoint.x / objectData.width * 2 - 1; //(startPoint.x) / objectData.width * 2 // it.scale.x;
                                        next.scale.y = -(startPoint.y) / objectData.height * 2 -1;// / it.scale.y;
                                        //next.scale.y = localPos.y/10;
                                        //const mx = moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                                        //const my = moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                                        //next.scale.x += mx;
                                        //next.position.x += -my * Math.sin(ang) / 2 + mx * Math.cos(ang) / 2;
                                        //next.scale.y -= my;
                                        //next.position.y += my * Math.cos(ang) / 2 + mx * Math.sin(ang) / 2;
                                        return next
                                    })
                                }}>
            
            </div>
            <div className="boneMarkersMove" style={{
                left: (centerPos.x /*+ cameraRef.current.getBoundingClientRect().width * cameraData.scale*/)  + 'px',
                top: (centerPos.y /*+ cameraRef.current.getBoundingClientRect().height * cameraData.scale*/)  + 'px'
            }} onDragStart={(e) => e.preventDefault()}
            onMouseDown={(e) => {
                e.stopPropagation()
                //onSelect(objectData);
                //if (isActive){
                    setDragStart(e);
                //}
            }}>
            
            </div>
        </div>}
    </div>
    </canvasContext.Provider>
}