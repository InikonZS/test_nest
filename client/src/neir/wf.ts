import { IVector } from '../three/common/IVector';

export const closest: Array<IVector> = [
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: -1, y: -1},
    {x: 1, y: -1},
    {x: 1, y: 1},
    {x: -1, y: 1},
]

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

const pattern = [
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
            allowed: allowed
        }
    });

    console.log(allowedSided);
    return allowedSided;

}

function checkAllowed(field:Array<Array<Array<any>>>, allowed:Array<Array<string>>, pos: IVector){
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

export function generate(){
    const rules = generateRules(pattern);
    let field = new Array(30).fill(null).map(it=> new Array(30).fill(null).map(jt=> /*[...cells]*/rules));

    for(let i=0; i< 6000; i++){
        let changed = false;
        let lowest = {
            length: 999,
            pos: {x:0, y:0}
        };
        field = field.map((row, y)=>{
            return row.map((cell, x)=>{
                const rw = cell.filter(cellVariant=>{
                    const res = checkAllowed(field, cellVariant.allowed, {x, y});
                    //const res = cellVariant.check(field, {x, y});
                    if (res == false){
                        changed = true;
                    }
                    return res;
                });
                if (rw.length<1){
                    i=6000;
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
        if (!changed){
            if (field[lowest.pos.y][lowest.pos.x].length == 1) {
                console.log('last el');
            } else{
            const random = Math.floor(Math.random()* field[lowest.pos.y][lowest.pos.x].length);
            field[lowest.pos.y][lowest.pos.x] = field[lowest.pos.y][lowest.pos.x].filter((it, i1)=> i1 != random);
            lowest.length = field[lowest.pos.y][lowest.pos.x].length;
            }
        }
    }

    return field;
}