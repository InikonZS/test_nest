const steps = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
];

export const raytrace = (_chunk)=>{
    const chunk = _chunk.map(it=>it.map(jt=>{
        if (jt == '-'){
            return 0;
        } else
        if (jt == '8'){
            return -1;
        } else {
            return 15;
        }
    }));
    const list = [];

    for (let k = 0; k< 16; k++){
    chunk.forEach((it, i)=>
        it.forEach((jt, j)=>{
            if (jt>0){
                steps.forEach(step=>{
                    if (chunk[i+step.y] && chunk[i+step.y][j+step.x] != null && chunk[i+step.y][j+step.x] >= 0 && chunk[i+step.y][j+step.x]<jt){
                        chunk[i+step.y][j+step.x] = jt -1;
                    }
                })
            }
    }));
}

    chunk.forEach((it, i)=>
        it.forEach((jt, j)=>{
            list.push({
                x: j, 
                y: i,
                level: jt
            })
    }));
    console.log(chunk);
    return list;
}