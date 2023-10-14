function vectorXMatrix(vector: Array<number>, matrix: Array<Array<number>>){
    return matrix.map((row)=>{
        return row.reduce((ac, mtl, index)=>{
            return ac + vector[index]*mtl;
        }, 0);
    })
}

function sigm(x) {
    return 1 / (1 + Math.exp( -1 * ( x - 0 )))
}

function sigmVector(vector: Array<number>){
    return vector.map((it)=> sigm(it));
}

function sigmedTransform(vector: Array<number>, matrix: Array<Array<number>>){
    return sigmVector(vectorXMatrix(vector, matrix));
}

//vectorXMatrix([1,2,3], [[1, 0, 0],[0, 1, 0],[0, 0, 1]]);