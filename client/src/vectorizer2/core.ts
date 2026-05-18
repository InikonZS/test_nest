export function toBitmap(img: HTMLImageElement, pos: { x: number, y: number }, presize: number, threshold: number, zero = '-', one = '8') {
    const canvas = document.createElement('canvas');
    //console.log(img)
    canvas.width = img.naturalWidth * presize;
    canvas.height = img.naturalHeight * presize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.naturalWidth * presize, img.naturalHeight * presize);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const selectColor = [];
    for (let k = 0; k < 4; k++) {
        selectColor.push(data.data[pos.y / presize * data.width * 4 + pos.x / presize * 4 + k]);
    }
    const arr = [];
    for (let i = 0; i < data.height; i++) {
        const row = [];
        for (let j = 0; j < data.width; j++) {
            const colors = [];
            for (let k = 0; k < 4; k++) {
                colors.push(data.data[i * data.width * 4 + j * 4 + k]);
            }
            const maxDiff = Math.abs(colors[3] - selectColor[3]);
            row.push(maxDiff < threshold ? one : zero);
        }
        arr.push(row);
    }
    return {
        bitmap: arr, 
        color: selectColor.map(it => (it.toString(16).length == 1 ? '0' : '') + it.toString(16)).join('')
    };
}

//distance from p0 to line p1-p2
export const pdist = (p0: { x: number, y: number }, p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    const top = (p2.y - p1.y) * p0.x - (p2.x - p1.x) * p0.y + p2.x * p1.y - p2.y * p1.x
    const down = Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2)
    return top / down;
}

export const getPoly = (bitmap: Array<Array<string>>, clickPos: {x: number, y: number}) => {
    const getInitialPosByFirst = () => {
        let index = -1;
        const rowIndex = bitmap.findIndex((row) => {
            index = row.findIndex(cell => {
                return cell == '8';
            })
            return index != -1;
        });
        return { x: index, y: rowIndex }
    }

    const getInitialPos = ()=>{
        let index = clickPos.x;
        let rowIndex = clickPos.y;
        for (let i=0; i<100; i++){
            let changes = 0;
            while(bitmap[rowIndex]?.[index - 1] == '8'){
                index--;
                changes++;
            }
            while(bitmap[rowIndex - 1]?.[index] == '8'){
                rowIndex--;
                changes++;
            }
            if (changes == 0){
                break;
            }
        }
        console.log('sz ind', index, rowIndex, clickPos.x, clickPos.y)
        return {x: index, y: rowIndex}
    }

    const pos = getInitialPos();
    const player = {
        x: pos.x,
        y: pos.y,
        direction: 0
    }

    const moves = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
    ]

    const leftHand = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
    ]

    const dirs = [
        -1,
        0,
        1,
        2
    ]

    const poly: Array<{ x: number, y: number }> = [];

    const tryMove = () => {
        if (bitmap[player.y + moves[player.direction].y]?.[player.x + moves[player.direction].x] == '8') {
            player.x = player.x + moves[player.direction].x;
            player.y = player.y + moves[player.direction].y;
            //draw();
            return true;
        }
        //draw();
    }

    const step = () => {
        const initDir = player.direction;

        for (let rots = 0; rots < 4; rots++) {
            if ((player.direction == 1 && rots == 3) || (player.direction == 1 && rots == 2)) {
                const lastPos = { ...player }
                poly.push({ x: lastPos.x + 1, y: lastPos.y + 1 });
            }

            player.direction = (4 + initDir + dirs[rots]) % 4;

            //console.log('post', player.direction, rots)
            {
                const lastPos = { ...player }
                if (
                    (player.direction == 3 && rots == 0)
                    || (player.direction == 2 && rots == 0)
                    || (player.direction == 1 && rots == 1)
                    || (player.direction == 2 && rots == 1)
                    || (player.direction == 3 && rots == 1)
                    || (player.direction == 1 && rots == 2)
                    || (player.direction == 2 && rots == 2)
                    || (player.direction == 0 && rots == 3)
                    || (player.direction == 1 && rots == 3)
                    || (player.direction == 2 && rots == 3)
                    || (player.direction == 3 && rots == 3)
                ) {
                    //if (bitmap[player.y + leftHand[player.direction].y]?.[player.x + leftHand[player.direction].x] != '8') {
                    const point = { x: lastPos.x + (leftHand[lastPos.direction].x <= 0 ? 0 : 1), y: lastPos.y + (leftHand[lastPos.direction].y <= 0 ? 0 : 1) };
                    if (poly.length && (poly[0].x == point.x && poly[0].y == point.y)) {
                        return true;
                    } else if (poly.length == 0 || (poly[poly.length - 1].x != point.x || poly[poly.length - 1].y != point.y)) {
                        poly.push(point);
                    }
                }
            }

            if (tryMove()) {
                //draw()
                return;
            }
        }
    }

    for (let i = 0; i < 100000; i++) {
        if (step()) {
            break;
        }
    }
    return poly;
}

export const optimizePolyDynamic = (poly: Array<{ x: number, y: number }>, val: number, val2: number) => {
    const polyIndexed = poly.map(it => ({ ...it, deleted: false, cnt: 0 }));
    const getPoint = (index: number) => {
        return polyIndexed[(index + polyIndexed.length) % polyIndexed.length];
    }
    for (let i = 0; i < polyIndexed.length; i++) {
        const prev = getPoint(i);
        const sums = [];
        let len = 180;
        for (let k = 0; k < len; k++) {
            const next = getPoint(i + k + 2);
            let sumSigned = 0;
            let sumUnsigned = 0;
            if (next.deleted){
                sumSigned = 99999;
            }
            let plist = []
            for (let sk = 0; sk < k + 1; sk++) {
                const current = getPoint(i + sk + 1);
                plist.push(current);
                const dist = pdist(current, prev, next);
                //sumSigned += dist / (k+1); //optional k
                //sumUnsigned += Math.abs(dist) / (k+1);
                sumSigned += dist // (k+1); //optional k q=1
                sumUnsigned += Math.abs(dist) // (k+1);
            }
            sums.push({
                sumSigned,
                sumUnsigned,
                k,
                plist
            })
            const q = val / 36;//11 //0.25 * k +1;
            if ((Math.abs(sumSigned) > 8 / q || sumUnsigned > 18.4 / (q)) || k == (len - 1)) {
                let kk = 1;//k;
                for (let op = k - 1; op >= 0; op--) {
                    if (Math.abs(sums[op].sumSigned) < /*0.77/(k+1)*/ 0.77 * (val2)) {
                        kk = op;
                        break;
                    }
                }
                console.log(sums);
                for (let sk = 0; sk < kk - 0; sk++) {
                    const current = getPoint(i + sk + 1);
                    current.deleted = true;
                }
                i += kk - 0;
                console.log('break')
                break;
            }
        }
    };
    return polyIndexed.filter(it => !it.deleted)//!it.deleted);
}

export function getBounds(verts: Array<number>) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < verts.length; i += 2) {
        const x = verts[i];
        const y = verts[i + 1];

        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }

    return {
        minX, minY,
        maxX, maxY,
        width: maxX - minX,
        height: maxY - minY,
        centerX: (minX + maxX) * 0.5,
        centerY: (minY + maxY) * 0.5
    };
}

export function toClipPolygon(verts: Array<number>){
    const points: Array<{x: number, y: number}> = [];
    verts.forEach((it, i, arr)=>{
        if (i % 2 ==0){
            return;
        }
        points.push({x: arr[i-1], y: arr[i]});
    });

    const bounds = getBounds(verts);

    const resultArr: Array<string> = [];
    points.forEach(it=>{
        resultArr.push(`${((it.x - bounds.minX) / bounds.width * 100).toFixed(2)}% ${((it.y - bounds.minY) / bounds.height * 100).toFixed(2)}%`)
    })

    return `polygon(${resultArr.join(',')})`
}