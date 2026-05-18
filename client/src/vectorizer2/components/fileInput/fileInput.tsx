import React, { useRef, useState } from "react";
import style from "./fileInput.m.css";

export const FileInput = ({className, children, type, style: propStyle, ...props}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
    const inputRef = useRef<HTMLInputElement>();

    return <div className={style.fileInput}>
        <input ref={inputRef} type='file' style={{ display: 'none'}} {...props} />

        <button type="button" style={propStyle} className={[style.fileInputButton, className].filter(Boolean).join(' ')} onClick={()=>{
            inputRef.current.click();
        }}>
            {children}
        </button>
    </div>
}

const processImageFile=(selectedFile: File, onReady: (image: HTMLImageElement)=>void)=>{
    if (!selectedFile){
        return;
    }
    const reader = new FileReader();
    reader.onload = ()=>{
        console.log('loaded');
        const img = new Image();
        img.onload= ()=>{
            onReady(img);
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


export const FileImageInput = ({onLoad}: {onLoad: (image: HTMLImageElement)=>void}) => {
    return <FileInput accept="image/*" multiple={false} onChange={(event)=>{
        processImageFile(event.target.files[0], (image)=>{
            onLoad(image);
        });
        event.target.value = '';
    }}>
        Open...
    </FileInput>
}
