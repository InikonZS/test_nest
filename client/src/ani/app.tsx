import React, { useEffect, useRef, useState } from "react";
import './app.css';

export function App() {
    return <div>
        <div className="ani_wrapper">
            <div className="ani_sprite2 ani_body"></div>
            <div className="ani_head_group">
                <div className="ani_sprite ani_rh"></div>
                <div className="ani_sprite ani_lh"></div>
                <div className="ani_sprite ani_fc"></div>
                <div className="ani_sprite2 ani_mus"></div>
            </div>
            
        </div>
    </div>
}