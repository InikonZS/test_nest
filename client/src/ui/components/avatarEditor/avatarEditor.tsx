import React, { useEffect, useMemo, useRef, useState } from "react";
import './avatarEditor.css';

interface IAvatarEditorProps{

}

export function AvatarEditor({}: IAvatarEditorProps){
    const [dragStart, setDragStart] = useState(false);
    const [position, setPosition] = useState({x: 0, y: 0});
    const [scale, setScale] = useState(1);
    const [originalImage, setOriginalImage] = useState<HTMLImageElement>(null);
    const [windowDragFile, setWindowDragFile] = useState<DataTransferItem>(null);
    const [formDrag, setFormDrag] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const imgParams = useMemo(()=>{
        if (!originalImage || !canvasRef.current || !position){
            return {};
        }
        const targetWidth = 250;
        const targetHeight = 250;
        const targetLeft = (canvasRef.current.width - targetWidth) / 2;
        const targetTop = (canvasRef.current.height - targetHeight) / 2;
    
        const img = originalImage;
        
        //const maxScaler = Math.max(canvasRef.current.width / img.naturalWidth, canvasRef.current.height / img.naturalHeight) *scale;
        const maxScaler = Math.max(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight) * Math.exp(scale);
        console.log(scale, Math.exp(scale));
        const maxX = img.naturalWidth * maxScaler;
        const maxY = img.naturalHeight * maxScaler;
        const center = {
            x: (canvasRef.current.width - maxX) / 2,
            y: (canvasRef.current.height - maxY) / 2,
        } 
        return {targetHeight, targetWidth, targetLeft, targetTop, maxScaler, maxX, maxY, center};
    }, [originalImage, scale, position, canvasRef]);

    useEffect(()=>{
        if (!originalImage || !canvasRef.current || !position){
            return;
        }
        const context = canvasRef.current.getContext('2d');
        const img = originalImage;
        const {targetHeight, targetWidth, targetLeft, targetTop, maxScaler, maxX, maxY, center} = imgParams;
        const resultPosX = Math.max(Math.min(center.x + position.x, + targetLeft), canvasRef.current.width - maxX - targetLeft);
        const resultPosY = Math.max(Math.min(center.y + position.y, + targetTop), canvasRef.current.height - maxY - targetTop);

        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, resultPosX, resultPosY, maxX , maxY);
        context.fillStyle = '#9999';
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
       
        //const cropScaler = Math.max(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight) * scale;
        //context.drawImage(img, -position.x, -position.y, maxX * canvasRef.current.width / targetWidth, maxY * canvasRef.current.height / targetHeight, targetLeft, targetTop, targetWidth, targetHeight);
        context.drawImage(img, -(resultPosX - targetLeft) / maxScaler, -(resultPosY - targetTop) /maxScaler, (targetWidth) / maxScaler , (targetHeight) / maxScaler, targetLeft, targetTop, targetWidth, targetHeight);

    }, [originalImage, canvasRef.current, position, scale]);

    useEffect(()=>{
        const handleDragOver = (e: DragEvent)=>{
            e.preventDefault();
            const foundFile = findDragDropFile(e.dataTransfer.items)
            if (foundFile){
                setWindowDragFile(foundFile);
            } else {
                setWindowDragFile(null);
            }
        };
        const handleDragLeave=(e: DragEvent)=>{
            console.log(e.target);
            if (!(e.relatedTarget as HTMLElement)?.closest('html')){
                setWindowDragFile(null)
            }
        }
        const handleDragEnd=(e: DragEvent)=>setWindowDragFile(null)
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragend', handleDragEnd);
        return ()=>{
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragend', handleDragEnd);
        }
    },[])

    
    const handleSubmit = ()=>{

    }

    const processFile=(selectedFile: File)=>{
        if (!selectedFile){
            return;
        }
        setOriginalImage(null)
        const reader = new FileReader();
        reader.onload = ()=>{
            console.log('loaded');
            const img = new Image();
            img.onload= ()=>{
                setOriginalImage(img);
            };
            img.src = reader.result as string;   
        }
        reader.onloadstart = ()=>{
            console.log('loading');
        }
        reader.onerror = ()=>{
            console.log('error');
        }
        reader.onabort = ()=>{
            console.log('abort');
        }
        reader.readAsDataURL(selectedFile);
    }

    const findDragDropFile = (items: DataTransferItemList)=>{
        if (items) {
            const foundFile = [...items].find((item, i) => {
                if (item.kind === "file") {
                    return true;
                }
            });
            return foundFile;
        }
        return null
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        processFile(selectedFile);
    }

    const handleCanvasMouseDown = ()=>{
        setDragStart(true);
        const handleMove = (e: MouseEvent)=>{
            console.log(e.movementX, e.movementY);
            const img = originalImage;
            
            const {targetLeft, targetTop, maxX, maxY, center} = imgParams;
            console.log(position);
            setPosition(last=> {
                //const resultPosX = last.x+ e.movementX + center.x;//Math.max(Math.min(center.x + last.x+ e.movementX, 0), canvasRef.current.width - maxX);
                //const resultPosY = last.y+ e.movementY + center.y;//Math.max(Math.min(center.y + last.y+ e.movementY, 0), canvasRef.current.height - maxY);
                const resultPosX = Math.max(Math.min(center.x + last.x + e.movementX, + targetLeft), canvasRef.current.width - maxX - targetLeft);
                const resultPosY = Math.max(Math.min(center.y + last.y + e.movementY, + targetTop), canvasRef.current.height - maxY - targetTop);
                return ({x: resultPosX - center.x , y: resultPosY - center.y })
            });
        }
        const handleUp = ()=>{
            setDragStart(false);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        }
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
    }

    const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setScale(e.target.valueAsNumber);
        setPosition(last=> ({x: last.x / Math.exp(scale) * e.target.valueAsNumber, y: last.y / Math.exp(scale) * e.target.valueAsNumber}))
    }

    const handleFormDragOver = (e: React.DragEvent)=>{
        e.preventDefault();
        if (windowDragFile){
            setFormDrag(true);
        }
    }

    const handleFormDragLeave = (e: React.DragEvent)=>{
        e.preventDefault();
        setFormDrag(false);
    }

    const handleFormDrop = (e:React.DragEvent)=>{
        e.preventDefault(); 
        setFormDrag(false);
        setWindowDragFile(null);
        const foundFile = findDragDropFile(e.dataTransfer.items)
        if (foundFile){
            const file = foundFile.getAsFile();
            processFile(file);
        } else {
            
        }
    }

    return <div className="avatarEditor_wrapper">
        <div className="avatarEditor_canvas_area" 
            onDragOver={handleFormDragOver}
            onDragLeave={handleFormDragLeave}
            onDrop={handleFormDrop}
        >
            {windowDragFile && <div>drag here</div>}
            {formDrag && <div>drop here</div>}
            <canvas 
                ref={canvasRef} 
                className="avatarEditor_canvas"
                width={400}
                height={300}
                onMouseDown={handleCanvasMouseDown}
                onDragStart={(e)=>e.preventDefault()}
                onSelect={(e)=>e.preventDefault()}
               
            ></canvas>
        </div>
        <div className="avatarEditor_form">
            <label htmlFor="af_label_id" className="avatarEditor_fileLabel">select file...</label>
            <input type="file" id={'af_label_id'} className="avatarEditor_fileInput" onChange={handleFileChange}></input>
            <input type="range" value={scale} onChange={handleScaleChange} min={0} max={3} step={0.001}></input>
            <button onClick={handleSubmit} className="avatarEditor_submitButton">submit</button>
        </div>
    </div>
}