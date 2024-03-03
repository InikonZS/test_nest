import React, { useEffect, useState } from "react";
import {Animal as AnimalModel} from "../../core/animal";
import './animal.css';

interface IAnimalProps{
    animalData: AnimalModel;    
}

export function Animal({animalData}: IAnimalProps){
    const dist = Math.hypot(animalData.lastPosition.x- animalData.position.x, animalData.lastPosition.y- animalData.position.y);
    return <div className="wf_animal" style={{left: animalData.position.x, top: animalData.position.y, 'transition-duration': dist *5 +'ms'}}>
        A
    </div>
}
