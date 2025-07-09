export const cut = (_chunk: Array<Array<string>>)=>{
    const chunk = _chunk.map(it=>it.map(jt=>jt));
    const list: Array<{y: number, x:number, sx:number, sy:number}> = [];

    chunk.forEach((it, i)=>
        it.forEach((jt, j)=>{
            let sizeX = 0;
            let sizeY = 0;
            if (chunk[i]?.[j] == '8'){
                sizeX = 1;
                sizeY = 1;

                for (let s =0; s<16; s++){
                let avX = true
                for (let k = 0; k<sizeX; k ++){
                    if (chunk[i +sizeY]?.[j+k] != '8'){
                        avX = false;
                    }
                }
                if (avX == true){
                    sizeY+=1;
                }
                let avY = true
                for (let k = 0; k<sizeY; k ++){
                    if (chunk[i+k]?.[j+sizeX] != '8'){
                        avY = false;
                    }
                }
                if (avY == true){
                    sizeX+=1;
                }

                for(let k =0; k< sizeY; k++){
                    for(let l =0; l< sizeX; l++){
                        chunk[i+k][j+l] = '+'
                    }
                }
            }

                list.push({y: i, x:j, sx:sizeX, sy:sizeY});
            }
        })
    );

    return list;
}