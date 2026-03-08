import React, { useEffect, useRef, useState } from "react"
import { getGlobalTransform } from "./utils";
import "./boneObject.css";
import { IBoneNode, IKeyFrame } from "./boneModel";
import { useCanvasContext } from "./boneCanvas";

export const BoneObject = ({ objectData, time, onChange, refMap }: { objectData: IBoneNode, time: number, onChange: (id: string, data: Omit<IKeyFrame, 'time'>) => void, refMap: React.MutableRefObject<Record<string, HTMLDivElement>> }) => {
    const ref = useRef<HTMLDivElement>();
    const tempRef = useRef<HTMLDivElement>();
    const [animation, setAnimation] = useState<Animation>(null);
    const [dragStart, setDragStart] = useState<React.MouseEvent>(null);
    const [temp, setTemp] = useState({ position: { x: 0, y: 0 }, angle: 0 })
    const _temp = useRef<any>()

    const { getLocalCursor } = useCanvasContext();

    const getCurrentTransform = () => {
        if (!objectData.keyframes || !objectData.keyframes.length) {
            return {
                translate: { x: objectData.position.x, y: objectData.position.y },
                rotate: 0,
                scale: { x: 1, y: 1 }
            }
        }
        const transformTRS = {
            translate: { x: 0, y: 0 },
            rotate: 0,
            scale: { x: 1, y: 1 }
        }
        if (!ref.current) {
            return transformTRS;
        }
        const transforms = ref.current.computedStyleMap().get('transform');
        if (transforms instanceof CSSTransformValue) {
            let trs = '';

            transforms.forEach((value) => {
                if (value instanceof CSSTranslate) {
                    trs = trs + 't';
                    transformTRS.translate.x = value.x.to('px').value;
                    transformTRS.translate.y = value.y.to('px').value;
                }
                if (value instanceof CSSRotate) {
                    trs = trs + 'r';
                    transformTRS.rotate = value.angle.to('deg').value;
                }
                if (value instanceof CSSScale) {
                    trs = trs + 's';
                    transformTRS.scale.x = Number(value.x);
                    transformTRS.scale.y = Number(value.y);
                }
            });
            if (!['trs', 'rs', 'ts', 'tr', 't', 'r', 's'].includes(trs)) {
                console.log('unsupported transform, readed partially');
            }
            return transformTRS;
        }
    }
    //getCurrentTransform();
    useEffect(() => {
        refMap.current[objectData.name] = ref.current;
        return () => {
            refMap.current[objectData.name] = undefined;
        }
    }, []);

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


    useEffect(() => {
        _temp.current = temp;
    }, [temp]);
    useEffect(() => {
        if (!dragStart) {
            return;
        }
        let lastPosX = dragStart.clientX;
        let lastPosY = dragStart.clientY;
        dragStart.stopPropagation();
        const matrix = getGlobalTransform(tempRef.current.parentElement);
        const moveHandler = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - lastPosX;
            const dy = moveEvent.clientY - lastPosY;
            lastPosX = moveEvent.clientX;
            lastPosY = moveEvent.clientY;
            console.log(dx, tempRef.current.style.left);
            setTemp(last => {
                const globalPos = matrix.transformPoint(new DOMPoint(last.position.x, last.position.y));
                const localPos = matrix.inverse().transformPoint(new DOMPoint(globalPos.x + dx, globalPos.y + dy));
                /*return {position: {
                    x: last.position.x + dx,
                    y: last.position.y + dy,
                }}*/
                return {
                    position: {
                        x: localPos.x,
                        y: localPos.y,
                    },
                    angle: last.angle
                }
            })
            console.log(JSON.stringify(_temp));
            //tempRef.current.style.left = tempRef.current.clientLeft + dx + 'px',
            //tempRef.current.style.top = tempRef.current.clientTop + dy + 'px'
            // setPosition(last => last + dx);
        }
        /*const upHandler = (moveEvent: MouseEvent)=>{
            setDragStart(null);
            onChange?.({position: {
                x: _temp.current.position.x + Number(getComputedStyle(ref.current).left.replace('px', "")),
                y: _temp.current.position.y + Number(getComputedStyle(ref.current).top.replace('px', "")),
            }});
            setTemp({position: {x: 0, y: 0}});
        }*/
        window.addEventListener('mousemove', moveHandler);
        //window.addEventListener('mouseup', upHandler);
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            // window.removeEventListener('mouseup', upHandler);
        }
    }, [dragStart]);

    useEffect(() => {
        const upHandler = (moveEvent: MouseEvent) => {
            setDragStart(null);
            if (temp.position.x == 0 && temp.position.y == 0 && temp.angle == 0) {
                return;
            }
            const objMatrix = new DOMMatrix(getComputedStyle(ref.current).transform);
            const tempMatrix = new DOMMatrix(getComputedStyle(tempRef.current).transform);
            //const point = objMatrix.transformPoint(new DOMPoint(temp.position.x, temp.position.y));
            const resMatrix = tempMatrix.multiply(objMatrix);
            const point = {
                x: getCurrentTransform().translate.x + temp.position.x,//temp.angle == 0 ? resMatrix.e : getCurrentTransform().translate.x,
                y: getCurrentTransform().translate.y + temp.position.y//temp.angle == 0 ? resMatrix.f : getCurrentTransform().translate.y
            }
            //const angle = Math.atan2(resMatrix.b, resMatrix.a) * 180 / Math.PI;
            //objMatrix.tra
            //const m = new DOMMatrix(getComputedStyle(ref.current).transform);
            //const rotation = Math.atan2(m.b, m.a);
            console.log(temp.angle, currentTransform.rotate)
            onChange?.(objectData.id, {
                position: {
                    x: point.x,//temp.position.x,//_temp.current.position.x + Number(getComputedStyle(ref.current).left.replace('px', "")),
                    y: point.y//temp.position.y//_temp.current.position.y + Number(getComputedStyle(ref.current).top.replace('px', "")),
                },
                angle: temp.angle + currentTransform.rotate
            });
            setTemp({ position: { x: 0, y: 0 }, angle: 0 });
        }
        //window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);
        return () => {
            //window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        }
    }, [dragStart, temp])

    useEffect(() => {
        if (!animation) { return };
        setTemp({ position: { x: 0, y: 0 }, angle: 0 });
        animation.currentTime = time;
        animation.commitStyles();
        //document.body.computedStyleMap()
        console.log(ref.current.style.transform);
    }, [time, animation]);
    useEffect(() => {
        setTemp({ position: { x: 0, y: 0 }, angle: 0 });
        if (!(objectData.keyframes && objectData.keyframes.length)) {
            return;
        }
        const keyframes = objectData.keyframes.sort((a: any, b: any) => a.time - b.time).map((keframeData: any) => {
            return {
                easing: 'linear',
                offset: (objectData.keyframes.length > 1) ? keframeData.time / objectData.keyframes[objectData.keyframes.length - 1].time : 0,
                transform: `translate(${keframeData.position.x / 1 + 'px'}, ${keframeData.position.y / 1 + 'px'}) rotate(${keframeData.angle || 0}deg)`,
                //left: keframeData.position.x + 'px',
                //top: keframeData.position.y + 'px'
            }
        });
        AnimationTimeline
        const effect = new KeyframeEffect(ref.current, keyframes, { duration: (objectData.keyframes.length > 1) ? objectData.keyframes[objectData.keyframes.length - 1].time : 1, fill: "forwards", direction: 'normal' });
        const animation = new Animation(effect);
        animation.pause();
        animation.currentTime = time;
        //animation.pause();
        //(window as any).a = (v: number)=>animation.currentTime=v;
        setAnimation(animation);
        //new Animation()
        return () => {
            //animation.commitStyles();
            animation.cancel();
        }
    }, [objectData.keyframes])
    const currentTransform = getCurrentTransform();
    return <div ref={tempRef} className="boneObjectTemp" style={{
        //left: temp.position.x,
        //top: temp.position.y
        //transformOrigin: `${objectData.position.x + objectData.width/2}px ${objectData.position.y + objectData.height/2}px`,
        transformOrigin: `${currentTransform.translate.x + objectData.width / 2}px ${currentTransform.translate.y + objectData.height / 2}px`,
        transform: `translate(${temp.position.x / 1 + 'px'}, ${temp.position.y / 1 + 'px'}) rotate(${temp.angle}deg)`,
    }}>
        <div className="boneObject"
            onDragStart={(e) => e.preventDefault()}
            onMouseDown={(e) => {
                e.stopPropagation()
                setDragStart(e);
            }}
            ref={ref}
            style={{
                display: (objectData.visible ?? true) ? '' : 'none',
                width: objectData.width / 1 + 'px',
                height: objectData.height / 1 + 'px',
                //left: objectData.position.x / 1 + 'px',
                //top: objectData.position.y / 1 + 'px',
                top: 0,
                left: 0,
                //transform: `translate(${objectData.position.x / 1 + 'px'}, ${objectData.position.y / 1 + 'px'}) rotate(${objectData.angle || 0}deg)`,
                transform: `translate(${currentTransform.translate.x / 1 + 'px'}, ${currentTransform.translate.y / 1 + 'px'}) rotate(${currentTransform.rotate || 0}deg)`,
                transformOrigin: `50% 50%`,
                backgroundImage: `url(${objectData.imageURL})`,
                backgroundColor: objectData.imageURL ? "transparent" : ""
            }}>
            <div>
                {objectData.objects && objectData.objects.map(it => {
                    return <BoneObject objectData={it} time={time} onChange={onChange} refMap={refMap}></BoneObject>
                })}
            </div>
            <div className="MindmapEditor_object_markers">

                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_rt"
                    onMouseDown={(downEvent) => {
                        /*const ang = it.angle / 180 * Math.PI;
                        handleMarkerSize(downEvent, (last, moveEvent) => {
                            const next = [...last];
                            const mx = moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                            const my = moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                            next[i].width += mx;
                            next[i].position.x += -my * Math.sin(ang) / 2 + mx * Math.cos(ang) / 2;
                            next[i].height -= my;
                            next[i].position.y += my * Math.cos(ang) / 2 + mx * Math.sin(ang) / 2;
                            return next
                        })*/
                    }}
                >
                </div>
                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_rb"
                    onMouseDown={(downEvent) => {
                        /*const ang = it.angle / 180 * Math.PI;
                        handleMarkerSize(downEvent, (last, moveEvent) => {
                            const next = [...last];
                            next[i].width += moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                            next[i].position.x += moveEvent.movementX / 2;
                            next[i].height += moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                            next[i].position.y += moveEvent.movementY / 2;
                            //next[i].position.y +=moveEvent.movementY;
                            return next
                        })*/
                    }}
                ></div>
                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_lb"
                    onMouseDown={(downEvent) => {
                        /*const ang = it.angle / 180 * Math.PI;
                        handleMarkerSize(downEvent, (last, moveEvent) => {
                            const next = [...last];
                            const mx = moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                            const my = moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                            next[i].width -= mx;
                            next[i].position.x += mx * Math.cos(ang) / 2 - my * Math.sin(ang) / 2;
                            next[i].height += my;
                            next[i].position.y += mx * Math.sin(ang) / 2 + my * Math.cos(ang) / 2;
                            return next
                        })*/
                    }}
                ></div>
                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_lt"
                    onMouseDown={(downEvent) => {
                        /*const ang = it.angle / 180 * Math.PI;
                        console.log(ang, Math.cos(ang));
                        handleMarkerSize(downEvent, (last, moveEvent) => {
                            const next = [...last];
                            const mx = moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                            const my = moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                            next[i].width -= mx;
                            next[i].position.x += moveEvent.movementX / 2;
    
                            next[i].height -= my;
                            next[i].position.y += moveEvent.movementY / 2;
                            return next
                        })*/
                    }}
                ></div>

                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_rotate"
                    onMouseDown={(downEvent) => {
                        //downEvent.stopPropagation();
                        //const it = objectData;
                        /*const m = new DOMMatrix(getComputedStyle(ref.current).transform);
                        const rotation = Math.atan2(m.b, m.a);
                        const scaleX = Math.hypot(m.a, m.b);
                        const scaleY = Math.hypot(m.c, m.d);*/
                        const trs = getCurrentTransform();
                        console.log(trs.rotate)
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
                            x: (it.width / 2) + Math.sin(ang) * (it.height / 2),
                            y: (it.height / 2) - Math.cos(ang) * (it.height / 2)
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
                    }}
                ></div>

            </div>
        </div>
    </div>
}