import React, { useEffect, useMemo, useRef, useState } from "react";
import './message.css';
import { IMessageData } from "./IMessageData";
import { Delay } from "../../core/delay";

interface IMessageViewProps {
    data: IMessageData,
    onClosed: ()=>void;
}

export function MessageView({data, onClosed}: IMessageViewProps){
    useEffect(()=>{
        const delay = new Delay(()=>{
            onClosed();
        }, 2000);
        return ()=>delay.cancel();
    }, []);
    return <div className="message_wrapper">
        {data.message}
    </div>
}