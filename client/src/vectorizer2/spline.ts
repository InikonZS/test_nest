import { getBounds, pdist } from "./core";

type IVector = {x: number, y: number};

export const vecSum = (v0: IVector, v1: IVector)=>{
    return {x: v0.x + v1.x, y: v0.y + v1.y}
}

export const vecSub = (v0: IVector, v1: IVector)=>{
    return {x: v0.x - v1.x, y: v0.y - v1.y}
}

export const vecScale = (v0: IVector, scale: number)=>{
    return {x: v0.x * scale, y: v0.y * scale}
}

export const vecDot = (v0: IVector, v1: IVector)=>{
    return v0.x * v1.x + v0.y * v1.y;
}

export const vecAbs = (v0: IVector)=>{
    return Math.hypot(v0.x, v0.y);
}

export const vecNorm = (v0: IVector)=>{
    return vecScale(v0, vecAbs(v0));
}

function signedAngle(a: IVector, b: IVector, c: IVector) {
    const ba = {
        x: a.x - b.x,
        y: a.y - b.y
    };

    const bc = {
        x: c.x - b.x,
        y: c.y - b.y
    };

    const cross = ba.x * bc.y - ba.y * bc.x;
    const dot = ba.x * bc.x + ba.y * bc.y;

    return Math.atan2(cross, dot); // [-PI, PI]
}

export const getBisect = (prev: IVector, current: IVector, next: IVector)=>{
    const u = vecScale(vecSub(current, prev), 1/vecAbs(vecSub(current, prev)));
    const v = vecScale(vecSub(next, current), 1/vecAbs(vecSub(next, current)));
    const b = vecScale(vecSum(u, v), 1/vecAbs(vecSum(u, v)));
    const t = {x: -b.y, y: b.x};
    return {
        bisect: t,
        normal: b,
        angle: signedAngle(prev, current, next)
    }
}
/*const getBisect = (
    prev: IVector,
    current: IVector,
    next: IVector
) => {
    const u = vecNorm(vecSub(current, prev));
    const v = vecNorm(vecSub(next, current));

    const sum = vecSum(u, v);

    if (vecAbs(sum) < 1e-6) {
        // почти 180°, fallback
        return {
            bisect: u,
            normal: u
        };
    }

    const t = vecNorm(sum);

    return {
        bisect: t,
        normal: t
    };
};*/

/*start, controlStart, controlEnd, end, t[0..1] */
const curveVal = (p0: number, p1: number, p2: number, p3: number, t: number)=>{
    return ((1 - t) ** 3) * p0 + (3 * (1 - t) ** 2) * t * p1 + (3 * (1 - t)) * (t ** 2) * p2 + (t ** 3) * p3;
}

const curvePoint = (p0: IVector, p1: IVector, p2: IVector, p3: IVector, t: number)=>{
    return {x: curveVal(p0.x, p1.x, p2.x, p3.x, t), y: curveVal(p0.y, p1.y, p2.y, p3.y, t)};
}

export const sampleCurve = (p0: IVector, p1: IVector, p2: IVector, p3: IVector, pointCount: number) =>{
    return new Array(pointCount).fill(null).map((it, i, arr)=>curvePoint(p0,p1,p2,p3, i/arr.length));
}

const pointToSegmentDistance = (point: IVector, lineStart: IVector, lineEnd: IVector)=>{
    const u = vecSub(lineEnd, lineStart);
    let t = vecDot(vecSub(point, lineStart), u) / vecDot(u, u);
    /*if (t<0 || t>1){
        return null;
    }*/
    const h = vecSum(lineStart, vecScale(u, t));
    const dist = vecAbs(vecSub(point, h));
    const sign = Math.sign(u.x* (point.y - h.y) - u.y* (point.x - h.x));
    if (t<0){
        return vecAbs(vecSub(point, lineStart)) * sign;
    }
    if (t>1){
        return vecAbs(vecSub(point, lineEnd)) * sign;
    }
    return dist * sign;
}

const pointToSampledCurveDistance = (sampleCurve: Array<IVector>, point: IVector)=>{
    let minDist = Number.MAX_VALUE;
    sampleCurve.forEach((it, i)=>{
        if (i == 0){
            return;
        }
        const currentDist = pointToSegmentDistance(point, sampleCurve[i-1], sampleCurve[i]);
        if (currentDist != null){
            minDist = Math.abs(currentDist) < Math.abs(minDist) ? currentDist : minDist;
            //console.log('md', minDist)
        }
    })
    if (minDist == Number.MAX_VALUE){
        console.log('md err')
    }
    return minDist; 
}

export const curveApproximationDiff = (sampleCurve: Array<IVector>, samplePath: Array<IVector>) =>{
    let totalDistanceSigned = 0;
    let totalDistanceUnsigned = 0;
    samplePath.forEach(point=>{
        const dist = pointToSampledCurveDistance(sampleCurve, point);
        totalDistanceSigned += dist;
        totalDistanceUnsigned += Math.abs(dist);
    });
    //console.log(totalDistanceSigned, totalDistanceUnsigned);
    return {
        signed: totalDistanceSigned,
        unsigned: totalDistanceUnsigned
    }
}

export const optimizeCurve = (s1: number, s2: number, step = 1, diff: (s1: number, s2: number)=>number) => {
    let best = diff(s1, s2);

    while (step > 0.01) {
        let improved = false;

        // optimize s1
        {
            const left  = diff(Math.max(s1 - step, 0), s2);
            const right = diff(Math.max(s1 + step, 0), s2);

            if (left < best) {
                s1 -= step;
                if (s1<0){
                    s1 = 0;
                }
                best = left;
                improved = true;
            } else if (right < best) {
                s1 += step;
                if (s1<0){
                    s1 = 0;
                }
                best = right;
                improved = true;
            }
        }

        // optimize s2
        {
            const left  = diff(s1, Math.min(s2 - step, 0));
            const right = diff(s1, Math.min(s2 + step, 0));

            if (left < best) {
                s2 -= step;
                if (s2>0){
                    s2 = 0;
                }
                best = left;
                improved = true;
            } else if (right < best) {
                s2 += step;
                if (s2>0){
                    s2 = 0;
                }
                best = right;
                improved = true;
            }
        }

        if (!improved) {
            step *= 0.85;
        }
    }

    return { s1, s2, best };
};

export function toClipPath(verts: Array<number>, allPoints: Array<IVector>){
    const points: Array<{x: number, y: number}> = [];
    verts.forEach((it, i, arr)=>{
        if (i % 2 ==0){
            return;
        }
        points.push({x: arr[i-1], y: arr[i]});
    });

    const bounds = getBounds(verts);

    const resultArr: Array<string> = [];
    const getPoint = (ind: number) =>{
        return points[(ind + points.length)%points.length];
    }

    const getPoints = <T>(points: Array<T>, start: number, end: number) => {
        if (start == end){
            return [];
        }
        const len = points.length;

        start = (((start + len) % len) + len) % len;
        end   = (((end + len) % len) + len) % len;

        if (start < end) {
            return points.slice(start, end);
        }

        return [
            ...points.slice(start),
            ...points.slice(0, end)
        ];
    };
    points.forEach((it, i)=>{
        const preprev = getPoint(i-2);
        const prev = getPoint(i-1);
        const current = getPoint(i);
        const next = getPoint(i+1);
        const bss = getBisect(preprev, prev, current);
        const bse = getBisect(prev, current, next);
        console.log(bse)
        const normVal = (val: number)=>{
            return ((val /*- bounds.minX*/) /* bounds.width * 100*/).toFixed(2)
        }
        const allPointsStartIndex = allPoints.findIndex((it)=>it.x == prev.x && it.y == prev.y)+ 1;
        const allPointsEndIndex = allPoints.findIndex((it)=>it.x == current.x && it.y == current.y);
        const segmentPoints = getPoints(allPoints, allPointsStartIndex, allPointsEndIndex);
        
        const len = Math.hypot(current.x - prev.x, current.y - prev.y);
const handles ={s1: (Math.abs(bss.angle) > (Math.PI - Math.PI / 6))? len / 3: 0, s2: (Math.abs(bse.angle) > (Math.PI - Math.PI / 6))? -len / 3: 0}
/*const handles = optimizeCurve(len / 3, -len / 3, len / 3, (s1, s2)=>{
    //console.log('dst', s1,s2);
        const curve = {
            p0: prev,
            p1: vecSum(vecScale(bss.normal, s1), prev),
            p2: vecSum(vecScale(bse.normal, s2), current),
            p3: current,
        }
    return curveApproximationDiff(sampleCurve(curve.p0, curve.p1, curve.p2, curve.p3, 10), segmentPoints).unsigned
})*/
        //const dist = //curveApproximationDiff(sampleCurve(curve.p0, curve.p1, curve.p2, curve.p3, 100), segmentPoints);
        //console.log('dst', dist.signed, dist.unsigned, segmentPoints, allPointsStartIndex, allPointsEndIndex, sampleCurve(curve.p0, curve.p1, curve.p2, curve.p3, 10));
        
        const cube = ()=>`C${normVal(bss.normal.x * handles.s1 + prev.x)} ${normVal(bss.normal.y * handles.s1 + prev.y)},${normVal(bse.normal.x * handles.s2 + current.x)} ${normVal(bse.normal.y * handles.s2 + current.y)},${normVal(current.x)} ${normVal(current.y)}`;
        const line = ()=>`L${normVal(current.x)} ${normVal(current.y)}`;

        const chunk = i==0 ? `M${normVal(it.x)} ${normVal(it.y)}` : cube(); 
        resultArr.push(chunk);
        //resultArr.push(`${i==0?'M':'L'}${normVal(it.x)} ${normVal(it.y)}`)
    })

    console.log(`path("${resultArr.join(' ')}z")`);
    return `${resultArr.join(' ')}z`//`path("${resultArr.join(' ')}z")`
}