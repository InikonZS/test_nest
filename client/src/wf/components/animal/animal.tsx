import React, { useContext, useEffect, useState } from "react";
import {Animal as AnimalModel} from "../../core/animal";
import './animal.css';
import { AssetsContext } from "../../assetsContext";

interface IAnimalProps{
    animalData: AnimalModel;    
}

export function Animal({animalData}: IAnimalProps){
    const {assets} = useContext(AssetsContext);
    const dist = Math.hypot(animalData.lastPosition.x- animalData.position.x, animalData.lastPosition.y- animalData.position.y);
    const angle = Math.atan2(animalData.lastPosition.y- animalData.position.y, -animalData.lastPosition.x+animalData.position.x) * 180 / Math.PI;
    //console.log('ang', angle, (Math.floor((angle + 22.5) / 45)*45 + 360) % 360);
    const roundAngle = (Math.floor((angle + 22.5) / 45)*45 + 360) % 360;
    const asset = assets[animalData.type+'_'+roundAngle] || assets[animalData.type];
    return <div className="wf_animal" style={{left: animalData.position.x, top: animalData.position.y, 'transition-duration': dist *5 +'ms', 'background-image': `url(${asset.objectUrl})`}}>
        {animalData.hungry.toFixed(2)}
    </div>
}
