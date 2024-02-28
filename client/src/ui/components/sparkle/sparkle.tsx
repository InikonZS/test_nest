import React from "react";
import './sparkle.css';

export function Sparkle(){
    const rand = ()=> Math.floor(Math.random() * 100) - 50;
    const particles = new Array(10).fill(null).map((_, i)=>{
        return <div className="sparkle_particle" style={{'offset-path': `path("M0,0 C${0},${0} ${rand()},${rand()} ${rand()},${rand()}")`, 'animation-delay': i*30+'ms'}}></div>
    });
    return <div className="sparkle_demo_wrapper">
        <div className="sparkle_container">
            {particles}
        </div>
    </div>
}