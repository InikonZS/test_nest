import React from 'react';
import './smallCard.css';

export function SmallCard(){
    return <div className='smallCard'>
        <div className='smallCard_title'>
            Example
        </div>
        <div className='smallCard_text'>
            This is a small demo example.
        </div>
        <div className='smallCard_preview'>
            preview
        </div>
        <div className='smallCard_links'>
            <button className='smallCard_button'>Source</button>
        </div>
    </div>
}