import React from 'react';
import './topSection.css';
import { Wheel } from '../../ui/components/wheel/wheel';
import { Paralax } from '../paralax/paralax';

export function TopSection(){
    return <div className='topSection'>
        <div className='topSection_wrapper'>
            <div className='topSection_back'>
                <Paralax></Paralax>
            </div>
            <div className='topSection_right'>
                <div className='topSection_title'>Playable code examples</div>
                <div className='topSection_name'>by Inikon</div>
                
            </div>
            <div className="topSection_mid_group" style={{width:"27px"}}>
                <div className='topSection_mid2 topSection_mid2_op'></div>
                <div className='topSection_mid2'></div>
               
            </div>
            <div className="topSection_mid_group"> 
                <div className='topSection_mid1 topSection_mid1_op topSection_midcp1'></div>
                <div className='topSection_mid1 topSection_midcp1'></div>
               
            </div>
            <div className="topSection_mid_group" style={{left:"-22px", width:"27px"}}>
                <div className='topSection_mid2 topSection_mid2_op topSection_midcp2'></div>
                <div className='topSection_mid2 topSection_midcp2'></div>
            </div>
            <div className="topSection_mid_group" style={{left:"-22px",  width: "27px"}}>
                <div className='topSection_mid1 topSection_mid1_op'></div>
                <div className='topSection_mid1'></div>
            </div>
            <div className='topSection_left'>
                <div className='topSection_bg'>
                    <Wheel></Wheel> 
                </div>
                
                <div className='topSection_text_wrapper'>
                    <div className='topSection_text_title'>Something about this project</div>
                    <div className='topSection_text'>someth dfsf fsdf s gsfds fdds f ing about this project</div>
                </div>
            </div>
        </div>
    </div>
}