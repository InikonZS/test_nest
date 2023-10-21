import { IVector } from '../three/common/IVector';

export const closest1: Array<IVector> = [
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: -1, y: -1},
    {x: 1, y: -1},
    {x: 1, y: 1},
    {x: -1, y: 1},
]

function genClosest(size:number = 1){
    const list: Array<IVector> = [];
    for (let i = -size; i<=size; i++){
        for (let j = -size; j<=size; j++){
            list.push({x:i, y:j});
        }
    }
    return list;
}

const closest = genClosest(1);

const cells2 = [
    {
        val: '-',
        check: (field: Array<Array<Array<any>>>, pos: IVector)=>{
            if (!field[pos.y]?.[pos.x+1]?.find(it=> it.val == '-') == undefined || !field[pos.y]?.[pos.x+1]?.find(it=> it.val == '+') == undefined){
                return false;
            }
            if (!field[pos.y]?.[pos.x-1]?.find(it=> it.val == '-') == undefined || !field[pos.y]?.[pos.x-1]?.find(it=> it.val == '+') == undefined){
                return false;
            }
            return true;
        }
    },
    {
        val: '|',
        check: (field: Array<Array<Array<any>>>, pos: IVector)=>{
            if (!field[pos.y+1]?.[pos.x]?.find(it=> it.val == '|') == undefined || !field[pos.y+1]?.[pos.x]?.find(it=> it.val == '+') == undefined){
                return false;
            }
            if (!field[pos.y-1]?.[pos.x]?.find(it=> it.val == '|') == undefined || !field[pos.y-1]?.[pos.x]?.find(it=> it.val == '+') == undefined){
                return false;
            }
            return true;
        }
    },
    {
        val: '+',
        check: (field: Array<Array<Array<any>>>, pos: IVector)=>{
            return true;
        }
    }
]

const cells = [
    {
        val: '1',
        check: (field: Array<Array<Array<any>>>, pos: IVector)=>{
            if (closest.every(closePos=>{
                const closeCell = field[pos.y+closePos.y]?.[pos.x + closePos.x];
                if (!closeCell) return true;
                const found = closeCell.find(jt=> jt.val == '2');
                if (!found){
                    return false;
                }
                return true;
            })){
                return true;
            }
            return false;
        }
    },
    {
        val: '2',
        check: (field: Array<Array<Array<any>>>, pos: IVector)=>{
            return true;
        }
    },
    {
        val: '3',
        check: (field: Array<Array<Array<any>>>, pos: IVector)=>{
            if (closest.every(closePos=>{
                const closeCell = field[pos.y+closePos.y]?.[pos.x + closePos.x];
                if (!closeCell) return true;
                const found = closeCell.find(jt=> jt.val == '2');
                if (!found){
                    return false;
                }
                return true;
            })){
                return true;
            }
            return false;
        }
    }
]

const pattern2 = [
    '                  ',
    '   ┏━━━━━━━━┓     ',
    ' ┏━┻━━┓     ┃     ',
    ' ┃    ┗━━┳━━┛ ┏━━┓',
    ' ┃       ┃    ┃  ┃',
    ' ┣━━━━━━━╋━━━━┫  ┃',
    ' ┃       ┃    ┃  ┃',
    ' ┗━━━━━━━┻━━━━┻━━┛',
    '                  '
]

const pattern3 = [
    ' -===--  ',
    '  ---    ',
    '  -==-   ',
    '  ---    '
];

const pattern4 = [
    ' *   * *       *   *    ',
    ' |  / /  *  *  |   | *  ',
    ' | / |    \\ |  |   | |  ',
    ' |/ /      \\|  |    \\|  '
];

export const pattern = [
    ' ┏━━━━━━━┓┏━━━┓ ',
    ' ┃       ┃┃   ┃ ',
    ' ┗━━━━━━━┛┗━━━┛ ',
    ' ┏━━━━━━━┓┏━━━┓ ',
    ' ┃       ┃┃   ┃ ',
    ' ┃       ┃┃   ┃ ',
    ' ┗━━━━━━━┛┗━━━┛ ',
    ' ┏━━━━━━━┓ ┏━┓  ',
    ' ┗━━━━━━━┛ ┗━┛  ',
    '                ',
    ' ┏━━━━━━━┓┏━━━┓ ',
    ' ┃       ┃┃   ┃ ',
    ' ┗━━━━━━━┛┗━━━┛ ',
];

const pattern7 = [
    '                      ',
    '              (=r=i=) ',
    '                [-]    ',
    '    (=r=i=)     [-]    ',
    '      [-]       [-]    ',  
    ' (====l=j=======l=j=) ',
    '                      '
];

const pattern8 = [
    '                                             ',
    '                                             ',
    '                         o                    ',
    '                         1                      ',
    '      (<=-=-=>)      (<=-+-=>)     <=-+-=>)         ',
    '                         |            |         ',
    '                         O            0        ',
    '                                     / L       ',
    '                                     1 1     ',
    '                                             ',
    '                                             ',
];

const pattern6 = [
    '                                             ',
    '                                             ',
    '                  y                           ',
    '                 qwe                             ',
    '               1234568                              ',
    '                  l                           ',
    '                                             ',
    '                                             ',
];

const pattern5 = [
    "┏━━━┛  ┃┃ ┃ ┃ ┃   ┏━┛┗━┓ ┗━┓ ┏",
    "┃      ┃┃ ┗━┛ ┗━┓ ┃    ┃   ┃ ┗",
    "┗━━━┓  ┃┃ ┏━┓   ┃ ┗━━┓ ┃   ┃ ┏",
    "┏━━━┛  ┃┃ ┃ ┃   ┃ ┏━━┛ ┗━━━┛ ┃",
    "┃      ┃┃ ┗━┛ ┏━┛ ┗━┓  ┏━━┓  ┃",
    "┛ ┏━━┓ ┃┃ ┏━┓ ┃     ┃  ┗━━┛  ┃",
    "  ┃  ┃ ┃┃ ┃ ┃ ┗━━━━━┛   ┏━┓┏━┛",
    "  ┗━━┛ ┃┃ ┗━┛ ┏━━━━━┓   ┃ ┃┃  ",
    "━┓ ┏━┓ ┃┃     ┗━━━━━┛ ┏━┛ ┃┃ ┏",
    "━┛ ┗━┛ ┃┃ ┏━┓  ┏━━━━┓ ┗━┓ ┃┃ ┃",
    "━┓     ┃┃ ┃ ┃  ┗━━━━┛   ┃ ┃┃ ┗",
    "━┛  ┏━━┛┗━┛ ┗━┓┏━━━━┓┏━━┛ ┃┃ ┏",
    "┓   ┃         ┃┃    ┃┃    ┃┃ ┗",
    "┃ ┏━┛ ┏━┓┏━━━━┛┗━┓┏━┛┗━━┓ ┃┃  ",
    "┛ ┃   ┃ ┃┃       ┃┃   ┏━┛ ┃┃ ┏",
    "  ┃   ┗━┛┗━┓┏━━┓ ┃┃   ┃   ┃┃ ┗",
    "  ┗━━┓┏━┓  ┃┃  ┃ ┃┃ ┏━┛   ┃┃ ┏",
    "     ┃┃ ┃  ┃┃  ┃ ┃┃ ┗━┓   ┃┃ ┃",
    "━━━┓ ┃┃ ┃  ┃┃  ┃ ┃┃ ┏━┛   ┃┃ ┗",
    "━━━┛ ┃┃ ┃  ┃┃  ┃ ┃┃ ┗━┓   ┃┃  ",
    "     ┃┃ ┗━━┛┗━━┛ ┃┃ ┏━┛ ┏━┛┗━┓",
    "┏━━┓ ┃┃          ┃┃ ┃   ┗━┓  ┃",
    "┗━━┛ ┃┃   ┏━┓┏━━━┛┗━┛     ┃  ┗",
    "┏━━┓ ┃┃   ┃ ┃┃       ┏━━┓ ┃  ┏",
    "┗━━┛ ┃┃ ┏━┛ ┃┃ ┏━━┓  ┃  ┃ ┃  ┃",
    "┏━┓  ┃┃ ┃   ┃┃ ┃  ┃  ┗━━┛ ┃  ┗",
    "┃ ┃  ┃┃ ┗━━━┛┗━┛  ┃   ┏━┓ ┗━┓┏",
    "┃ ┃  ┃┃ ┏━━━┓   ┏━┛   ┗━┛   ┃┃",
    "┃ ┃  ┃┃ ┃   ┃   ┗━┓┏━┓      ┃┃",
    "┛ ┗━━┛┗━┛ ┏━┛     ┃┃ ┃  ┏━┓ ┃┃"
]

function generateRules(pattern: Array<string>){
    const obj: Record<string, number> = {};
    pattern.join('').split('').forEach(letter=>{
        obj[letter] = 1;
    });
    const letters = Object.keys(obj);

    const findPositions = (letter:string)=>{
        const positions:Array<IVector> = [];
        pattern.forEach((row,y)=>{
            row.split('').forEach((sym, x)=>{
                if (letter == sym){
                    positions.push({x, y});
                }
            })
        })
        return positions;
    }

    console.log('letters', letters);

    const allowedSided = letters.map(it=>{
        const letterPositions = findPositions(it);
        const allowed = closest.map(jt=>{
            const allowedObj:Record<string, number> = {};
            letterPositions.forEach(lp=>{
                const sided = pattern[lp.y+jt.y]?.[lp.x+jt.x];
                if(sided != undefined){
                    allowedObj[sided]=1;
                }
            })
            return Object.keys(allowedObj);
        })
        return {
            val: it,
            allowed: allowed,
        }
    });

    console.log(allowedSided);
    return allowedSided;

}

function checkAllowed(field:Array<Array<Array<any>>>, allowed:Array<Array<string>>, pos: IVector, maxLength: number){
    if (closest.every((closePos, closeId)=>{
        const closeCell = field[pos.y+closePos.y]?.[pos.x + closePos.x];
        if (!closeCell) return true;
        const found = closeCell.find(jt=> allowed[closeId].some((kt)=>jt.val == kt));
        if (!found){
            return false;
        }
        return true;
    })){
        return true;
    }
    return false;
    /*closest.find((closestPos, closestId)=>{
        field[pos.y + closestPos.y]?.[pos.x + closestPos.x]
    })*/
}

function fastCheck(field:Array<Array<Array<any>>>, pos: IVector, maxLength: number){
    if (closest.every((closePos, closeId)=>{
        const closeCell = field[pos.y+closePos.y]?.[pos.x + closePos.x];
        if (!closeCell) return true;
        closeCell.length == maxLength;
    })) {
        return true;
    }
    return false;
}

export function generate(pattern: Array<string>, sizeX: number, sizeY: number){
    
    const rules = generateRules(pattern);
    let field = new Array(sizeY).fill(null).map(it=> new Array(sizeX).fill(null).map(jt=> /*[...cells]*/rules));
    const historyFields: Array<string> = [];
    let fieldSc = new Array(sizeY).fill(null).map(it=> new Array(sizeX).fill(false));
    const maxLength = field[0][0].length;
    console.log(maxLength);
    const iterations = 12000;
    for(let i=0; i< iterations; i++){
        let breaked = false;
        let changed = false;
        let lowest = {
            length: 999,
            pos: {x:0, y:0}
        };
        if (i % 20 == 0){
            console.log('progress', i);
        }
        field = field.map((row, y)=>{
            return row.map((cell, x)=>{
                if (breaked == true){
                    changed = true;
                    return cell;
                }
                if (cell.length == 0){
                    console.log('breaked', i);
                    return cell;
                }
                if (cell.length == 1){
                    //return cell;
                }

                if (fieldSc[y][x] == false){
                    return cell;
                }

                if (cell.length == maxLength && fastCheck(field, {x,y}, maxLength)){
                    return cell;
                }
                
                const rw = cell.filter(cellVariant=>{
                    const res = checkAllowed(field, cellVariant.allowed, {x, y}, maxLength);
                    //const res = cellVariant.check(field, {x, y});
                    if (res == false){
                        changed = true;
                        closest.forEach((closePos, closeId)=>{
                            const closeCell = fieldSc[y+closePos.y]?.[x + closePos.x];
                            if (closeCell == undefined) return true;
                            fieldSc[y+closePos.y][x + closePos.x] = true;
                        });
                    }
                    return res;
                });
                
                if (rw.length<1){
                    console.log('break', i);
                    breaked = true;
                    //field = JSON.parse(historyFields.pop());
                    //changed = true;
                    //i=iterations;
                }
                if (rw.length <= lowest.length && rw.length > 1){
                    lowest = {
                        length: rw.length,
                        pos: {x, y}
                    }
                } else if (lowest.length == 1 && rw.length > 1){
                    lowest = {
                        length: rw.length,
                        pos: {x, y}
                    }
                } else {
                    //console.log('nc')
                }
                return rw
            });
        });
        if (breaked){
            field = JSON.parse(historyFields.pop());
            console.log('history fields', historyFields.length);
            changed = false;
        }
        if (!changed){
            if (field[lowest.pos.y][lowest.pos.x].length == 1) {
                console.log('last el');
                break;
            } else{
            if (!breaked){
            historyFields.push(JSON.stringify(field));
            if (historyFields.length>10){
                historyFields.shift();
            }}
            const random = Math.floor(Math.random()* field[lowest.pos.y][lowest.pos.x].length);
            field[lowest.pos.y][lowest.pos.x] = field[lowest.pos.y][lowest.pos.x].filter((it, i1)=> i1 != random);
            lowest.length = field[lowest.pos.y][lowest.pos.x].length;
            closest.forEach((closePos, closeId)=>{
                const closeCell = fieldSc[lowest.pos.y+closePos.y]?.[lowest.pos.x + closePos.x];
                if (closeCell == undefined) return true;
                fieldSc[lowest.pos.y+closePos.y][lowest.pos.x + closePos.x] = true;
            });
            }
        }
    }

    return field;
}