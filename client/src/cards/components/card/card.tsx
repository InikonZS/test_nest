import React, { useEffect, useState } from "react";
import './card.css';

type CardProps = {
    value: number;
    type: number;
    selected: boolean;
}

export default function CardView({ value, type,  selected }: CardProps) {
    return (
        <div className='card' style={{ '--c-phase': selected?100:0}}>
            <div className='card_base card_a card_img' style={{ '--value': value + 1, '--type': type }} >
                {value}
            </div>
            <div className='card_base card_b  card_img' style={{ '--value': 2, '--type': 4 }}>
            </div>
        </div>
    )
}