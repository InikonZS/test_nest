import React, { useState } from "react";
import { Collapser } from "../components/collapser/Collapser";
import { CloseButton } from "../components/styled/BasicBlocks";
import { IMindmapFile } from "./IMindmapFileType";
import { TimeTrack } from "../components/timeTrack/TimeTrack";
import "./editor.css";

interface IMindmapEditorProps{
    data: IMindmapFile;
    onClose: ()=>void;
}

export const MindmapEditor = ({data, onClose}: IMindmapEditorProps)=>{
    const [basicCollapsed, setBasicCollapsed] = useState(false);
    const [cursorPoint, setCursorPoint] = useState({x: 0, y: 0});
    const [objects, setObjects] = useState([
        {
            position: {x: 0, y: 0},
            width: 100,
            height: 150,
            angle: 0,
            text: "test1",
            style: 'box'
        }
    ]);

    const addObject = (data: any)=>{
        setObjects(last=>{
            const next = [...last];
            next.push(data);
            return next;
        });
    }

    const handleMarkerSize = (downEvent: React.MouseEvent, setter: (value: any, moveEvent: MouseEvent)=>any)=>{
        downEvent.stopPropagation();
        console.log('down marker')
        const moveHandler = (moveEvent: MouseEvent)=>{
            setObjects(last=>{
                return setter(last, moveEvent)
            });
        }
        const upHandler = (moveEvent: MouseEvent)=>{
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        }
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);
    }

    return <div className="MindmapEditor">
        <div className="MindmapEditor_wrapper">
            <div className="MindmapEditor_tools">
                <div className="MindmapEditor_tools_header">
                    <div className="MindmapEditor_tools_header_title">
                        Mindmap
                    </div>
                    <CloseButton onClick={onClose}></CloseButton>
                </div>
                <div className="MindmapEditor_tools_categories">
                    <div className="MindmapEditor_toolsCollapser_head" onClick={()=>setBasicCollapsed(last=>!last)}>
                        <div className="MindmapEditor_toolsCollapser_head_title">Basic</div>
                        <div className="MindmapEditor_toolsCollapser_head_arrow">^</div>
                    </div>
                    <Collapser className="MindmapEditor_toolsCollapser_collapser" collapsed={!basicCollapsed}>
                        <div className="MindmapEditor_toolsCollapser_items">
                            <div className="MindmapEditor_tool MindmapEditor_tool--box" onClick={()=>{
                                addObject({
                                    position: {x: 0, y: 0},
                                    width: 100,
                                    height: 150,
                                    angle:0,
                                    text: "test" + (objects.length +1),
                                    style: "box"
                                });
                            }}>box</div>
                            <div className="MindmapEditor_tool MindmapEditor_tool--round" onClick={()=>{
                                addObject({
                                    position: {x: 0, y: 0},
                                    width: 100,
                                    height: 100,
                                    angle:0,
                                    text: "test" + (objects.length +1),
                                    style: "round"
                                });
                            }}>round</div>
                        </div>
                    </Collapser>
                    
                </div>
            </div>
            <div className="MindmapEditor_right">
                <div className="MindmapEditor_right_header">
                    <div className="MindmapEditor_right_header_title">
                        Dashboard
                    </div>
                    <CloseButton onClick={onClose}></CloseButton>
                </div>
                <div className="MindmapEditor_workspace">
                    {objects.map((it, i)=>{
                        return <div className={`MindmapEditor_object MindmapEditor_object--${it.style}`} 
                        style={{
                            top: (it.position.y - it.height/2)+"px",
                            left: (it.position.x - it.width/2) +'px',
                            width: it.width+'px',
                            height: it.height+'px',
                            transform: `rotate(${it.angle || 0}deg)`
                        }} 
                        onMouseDown={(downEvent)=>{
                            console.log('down')
                            const moveHandler = (moveEvent: MouseEvent)=>{
                                setObjects(last=>{
                                    const next = [...last];
                                    next[i].position.x +=moveEvent.movementX;
                                    next[i].position.y +=moveEvent.movementY;
                                    return next
                                });
                            }
                            const upHandler = (moveEvent: MouseEvent)=>{
                                window.removeEventListener('mousemove', moveHandler);
                                window.removeEventListener('mouseup', upHandler);
                            }
                            window.addEventListener('mousemove', moveHandler);
                            window.addEventListener('mouseup', upHandler);
                        }}>
                            {it.text}
                            <div className="MindmapEditor_object_markers">
                                
                                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_rt" 
                                    onMouseDown={(downEvent)=>{
                                        const ang = it.angle / 180 * Math.PI;
                                        handleMarkerSize(downEvent, (last, moveEvent)=>{
                                            const next = [...last];
                                            const mx = moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                                            const my = moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                                            next[i].width += mx;
                                            next[i].position.x += -my * Math.sin(ang)/2 +mx*Math.cos(ang)/2;
                                            //next[i].position.y += moveEvent.movementX * Math.sin(ang) * Math.cos(ang);
                                            //if (moveEvent.movementX!=0){
                                              //  next[i].position.y -= mx * my / moveEvent.movementX;
                                            //}
                                            
                                            next[i].height -= my;
                                            next[i].position.y += my * Math.cos(ang)/2 + mx*Math.sin(ang)/2;
                                            /*next[i].width +=moveEvent.movementX;
                                            next[i].height -=moveEvent.movementY;
                                            next[i].position.y +=moveEvent.movementY;*/
                                            //const mx = moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                                            //const my = moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                                            //next[i].width += mx// * Math.cos(ang) + mx * Math.sin(ang);
                                            //next[i].position.x += moveEvent.movementX//* Math.cos(ang);
                                            
                                            //next[i].height -= my//* Math.cos(ang) + my * Math.sin(ang);
                                            //next[i].position.y+=my;
                                            //next[i].position.x+=mx;
                                            //next[i].position.y += moveEvent.movementY //* Math.cos(ang);
                                            //next[i].position.x += moveEvent.movementY 
                                            return next
                                        })
                                    }}
                                >
                                </div>
                                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_rb" 
                                    onMouseDown={(downEvent)=>{
                                        const ang = it.angle / 180 * Math.PI;
                                        handleMarkerSize(downEvent, (last, moveEvent)=>{
                                            const next = [...last];
                                            next[i].width +=moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                                            next[i].position.x += moveEvent.movementX/2;
                                            next[i].height +=moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                                            next[i].position.y += moveEvent.movementY/2;
                                            //next[i].position.y +=moveEvent.movementY;
                                            return next
                                        })
                                    }}
                                ></div>
                                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_lb" 
                                    onMouseDown={(downEvent)=>{
                                        const ang = it.angle / 180 * Math.PI;
                                        handleMarkerSize(downEvent, (last, moveEvent)=>{
                                            const next = [...last];
                                            const mx = moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                                            const my = moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                                            next[i].width -= mx;
                                            next[i].position.x += mx * Math.cos(ang) /2 - my * Math.sin(ang)/2;
                                            //next[i].position.y += moveEvent.movementX * Math.sin(ang) * Math.cos(ang);
                                            //if (moveEvent.movementX!=0){
                                              //  next[i].position.y -= mx * my / moveEvent.movementX;
                                            //}
                                            
                                            next[i].height += my;
                                            next[i].position.y += mx * Math.sin(ang)/2 + my * Math.cos(ang)/2;
                                            //next[i].position.y += my * Math.cos(ang);
                                            //next[i].position.x += moveEvent.movementY * Math.sin(ang) * Math.cos(ang);

                                            //next[i].position.y += moveEvent.movementY;
                                            //if (moveEvent.movementY!=0){
                                            //    next[i].position.x -= mx * my / moveEvent.movementY;
                                            //}
                                            //next[i].position.y += moveEvent.movementY;

                                            /*next[i].width -=moveEvent.movementX;
                                            next[i].position.x +=moveEvent.movementX;
                                            next[i].height +=moveEvent.movementY;*/
                                            //next[i].position.y +=moveEvent.movementY;
                                            return next
                                        })
                                    }}
                                ></div>
                                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_lt" 
                                    onMouseDown={(downEvent)=>{
                                        const ang = it.angle / 180 * Math.PI;
                                        console.log(ang, Math.cos(ang));
                                        handleMarkerSize(downEvent, (last, moveEvent)=>{
                                            const next = [...last];
                                            /*next[i].width -=moveEvent.movementX;
                                            next[i].position.x +=moveEvent.movementX;
                                            next[i].height -=moveEvent.movementY;
                                            next[i].position.y +=moveEvent.movementY;*/
                                            //const widthInc = moveEvent.movementX * Math.cos(ang);
                                            /*ang = 0; -1
                                                    +1 moveEvent.movementX * Math.cos(ang)
                                            ang = 180
                                            +1
                                            0*/
                                            const mx = moveEvent.movementX * Math.cos(ang) + moveEvent.movementY * Math.sin(ang);
                                            const my = moveEvent.movementY * Math.cos(ang) - moveEvent.movementX * Math.sin(ang);
                                            next[i].width -= mx;
                                            next[i].position.x += moveEvent.movementX/2;
                                            
                                            next[i].height -= my;
                                            next[i].position.y += moveEvent.movementY/2;
                                            return next
                                        })
                                    }}
                                ></div>

                                <div className="MindmapEditor_object_marker MindmapEditor_object_marker_rotate" 
                                    onMouseDown={(downEvent)=>{
                                        const ang = it.angle / 180 * Math.PI;
                                        const startPoint = {
                                            x: (it.position.x + it.width /2) + Math.sin(ang)*(it.height /2),
                                            y: (it.position.y + it.height /2) - Math.cos(ang)*(it.height /2)
                                        }
                                        const centerPoint = {
                                            x: it.position.x + it.width /2,
                                            y: it.position.y + it.height /2
                                        }
                                        const lastAng = it.angle;
                                        //setCursorPoint(startPoint);
                                        handleMarkerSize(downEvent, (last, moveEvent)=>{
                                            
                                            console.log(startPoint);
                                            startPoint.x += moveEvent.movementX;
                                            startPoint.y += moveEvent.movementY;
                                            const next = [...last];
                                            //console.log(Math.sin(next[i].angle / 180 * Math.PI) + Math.cos(next[i].angle / 180 * Math.PI), );
                                            next[i].angle = Math.atan2(startPoint.x - centerPoint.x, -(startPoint.y - centerPoint.y)) / Math.PI * 180;
                                            const difAng = next[i].angle - lastAng;
                                            //next[i].position.x += Math.cos(difAng) * moveEvent.movementY + Math.sin(difAng) * moveEvent.movementX;
                                            //next[i].position.y += Math.cos(difAng) * moveEvent.movementX - Math.sin(difAng) * moveEvent.movementY;
                                            return next
                                        })
                                    }}
                                ></div>
                                
                            </div>
                        </div>
                    })}
                    {/*<div className="MindmapEditor_object_marker" style={{left: cursorPoint.x+'px', top: cursorPoint.y+'px'}}></div>*/}
                </div>
            </div>
        </div>
    </div>
}