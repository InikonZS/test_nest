import React from "react";
import './proCard.css';

export function ProCard(){
    return <div className="proCard_wrapper">
        <div className="proCard_title">Project Title</div>
        <div className="proCard_technologies">
            <div className="proCard_technology">React</div>
            <div className="proCard_technology">Pixi</div>
        </div>
        <div className="proCard_center">
            <div className="proCard_img"></div>
            <div className="proCard_text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cum, eveniet facere magnam ullam iusto esse, voluptatem pariatur illum soluta, fugit eligendi excepturi molestias ab temporibus doloribus officia at exercitationem?
            </div>
        </div>
        <div className="proCard_links">
            <div className="proCard_link">Play</div>
            <div className="proCard_link">Source</div>
        </div>
    </div>
}