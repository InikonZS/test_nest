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
    return <div className="wf_animal" style={{left: animalData.position.x, top: animalData.position.y, 'transition-duration': dist *5 +'ms', 'background-image': `url(${assets[animalData.type].objectUrl})`}}>

    </div>
}
