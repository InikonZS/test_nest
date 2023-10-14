import React, { useEffect, useState } from "react";
import './field.css';

export function Field() {
    const field = [
        '-------',
        '-++++--',
        '-+-+++-',
        '-+++++-',
        '---+++-',
        '----+--',
    ]
    return <div className="field_wrapper">
        {
            field.map((it, y)=>{
                return <div className="field_row">
                    {
                        it.split('').map((jt, x)=>{
                            const baseClassName = jt == '-' ? 'field_cell_base field_cell_empty' : 'field_cell_base field_cell';
                            const borders: Array<string> = [];
                            if (jt=='+'){
                                let right = field[y]?.[x + 1];
                                if (right == undefined || right == '-'){borders.push('right')}

                                let left = field[y]?.[x - 1];
                                if (left == undefined || left == '-'){borders.push('left')}

                                let top = field[y - 1]?.[x];
                                if (top == undefined || top == '-'){borders.push('top')}

                                let bottom = field[y + 1]?.[x];
                                if (bottom == undefined || bottom == '-'){borders.push('bottom')}
                            }
                            const borderRounds: Array<string> = [];
                            if (borders.includes('right') && borders.includes('top')){
                                borderRounds.push('rt');
                            }
                            if (borders.includes('right') && borders.includes('bottom')){
                                borderRounds.push('rb');
                            }
                            if (borders.includes('left') && borders.includes('top')){
                                borderRounds.push('lt');
                            }
                            if (borders.includes('left') && borders.includes('bottom')){
                                borderRounds.push('lb');
                            }
                            const className = [baseClassName, ...borders.map(it=> baseClassName+'_'+it),  ...borderRounds.map(it=> baseClassName+'_'+it)].join(' ');
                            return <div className={className}></div>
                        })
                    }
                </div>
            })
        }
    </div>
}