export const patterns = {
    disco: [
        [   
            '--F--',
            '++T++',
        ]
    ],
    bomb: [
        [   
            'FT++',
            '-+--',
            '-+--',
        ],
        [   
            '-F-',
            '+T+',
            '-+-',
            '-+-',
        ],
    ],
    rocket: [
        [   
            '-F--',
            '+T++',
        ]
    ],
    heli: [
        [   
            'FT+',
            '-++',
        ]
    ],
    rowThree: [
        ['FT++'],
        [
            '-F-',
            '+T+'
        ],
        [
            '--F',
            '++T'
        ]
    ]
}

function transpone(pattern: Array<string>){
    const res: Array<Array<string>> = new Array(pattern[0].length).fill(null).map(it=>new Array(pattern.length).fill(''));
    pattern.map((row, y)=> row.split('').map((cell, x)=>{
        res[x][y]=cell;
    }))
    return res.map(it=> it.join(''));
}

function getMirroredPatterns(pattern: Array<string>): Array<Array<string>>{
    const mh = pattern.map(it=> it.split('').reverse().join(''));
    const mv = [...pattern].reverse();
    const mvh = [...pattern].reverse().map(it=> it.split('').reverse().join(''));
    return [pattern, mh, mv, mvh];
}

export function getTransformedPatterns(pattern: Array<string>){
    return [...getMirroredPatterns(pattern), ...getMirroredPatterns(transpone(pattern))];
}