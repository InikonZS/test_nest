import { useContext, useRef } from "react";
import { IBoneNode, useBoneContext } from "./boneModel";
import { getGlobalTransform } from "./utils";
import React from "react";

const canvasContext = React.createContext<{getLocalCursor: (it: IBoneNode, pos: {x: number, y: number})=>{x: number, y: number}}>({getLocalCursor: null});

export const useCanvasContext = ()=>useContext(canvasContext);

export const BoneCanvas = ({children, refMap}: React.PropsWithChildren<{refMap: any}>) => {
    const cameraRef = useRef<HTMLDivElement>();
    //const refMap = useRef<Record<string, HTMLDivElement>>({});
    const {model, setModel} = useBoneContext();
    
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

    return <canvasContext.Provider value={{getLocalCursor: getLocalCursor}}><div className="boneCanvas" onMouseMove={(e) => {
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
        <div className="boneCamera" ref={cameraRef}>
            {children}
        </div>
    </div>
    </canvasContext.Provider>
}