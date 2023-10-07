const closest = [
    {x: 0, y: 1},
    {x: 0, y: -1},
    {x: 1, y: 1},
    {x: 1, y: -1},
    {x: -1, y: 1},
    {x: -1, y: -1},
    {x: -1, y: 0},
    {x: 1, y: 0},
]

class Pixel{
    position: IVector;
    type: string = '#fff';
    connections: Array<Pixel> = [];

    constructor(position: IVector){
        this.position = position;
    }

    react(objects: Array<Pixel>, map: Array<Array<Pixel>>){
    
    }

    maxConnections(){
        return 0;
    }
}

function averageAcceleration(myPoint: IVector, points: Array<IVector>, dist:number){
    const average: IVector = {x: 0, y: 0};
    points.forEach(it=>{
        let distSquared = ((it.x - myPoint.x) ** 2 + (it.y - myPoint.y) ** 2);
        distSquared = Number.isNaN(distSquared) ? 0 : distSquared;
        if (distSquared>90 ** 2){
            distSquared = 1000000;
        }

        if (distSquared<dist ** 2){
            distSquared = -distSquared /50.2 * distSquared **0.5 ;
        }
        distSquared *= (Math.random()/1 + 1)
        const speed = 0.031;
        const incx = (-myPoint.x + it.x) / distSquared * speed;
        const incy = (-myPoint.y + it.y) / distSquared * speed;
        average.x += Number.isNaN(incx) ? 0 : incx;
        average.y += Number.isNaN(incy) ? 0 : incy;
    })
    return average;
}

function springAcceleration(myPoint: IVector, points: Array<IVector>, dist:number){
    const average: IVector = {x: 0, y: 0};
    points.forEach(it=>{
        let distSquared = ((it.x - myPoint.x) ** 2 + (it.y - myPoint.y) ** 2);
        distSquared = Number.isNaN(distSquared) ? 0 : distSquared;

        if (distSquared<dist ** 2){
            distSquared = -distSquared /50.2 * distSquared **0.5 ;
        }

        distSquared *= (Math.random()/1 + 1)
        const speed = 0.00031;
        if (distSquared>0){
        const incx = (-myPoint.x + it.x) * distSquared * speed;
        const incy = (-myPoint.y + it.y) * distSquared * speed;
        average.x += Number.isNaN(incx) ? 0 : incx;
        average.y += Number.isNaN(incy) ? 0 : incy;
        } else {
            const incx = (-myPoint.x + it.x) / distSquared * 0.01
            const incy = (-myPoint.y + it.y) / distSquared * 0.01;
            average.x += Number.isNaN(incx) ? 0 : incx;
            average.y += Number.isNaN(incy) ? 0 : incy;
        }
        
    })
    return average;
}

function findClosest(myPoint: Pixel, points: Array<Pixel>){
    const obj = points.filter(it=>it!=this).map(it=> ({original: it, dist:((it.position.x - myPoint.position.x) ** 2 + (it.position.y - myPoint.position.y) ** 2)})).sort((a, b)=>a.dist-b.dist)[0];
    return obj;
}

class PixelA_ extends Pixel{
    position: IVector;
    connectingDist: number = 30;
    disconnectingDist: number = 40;
    springDist: number = 3;
    
    constructor(position: IVector){
        super(position);
        this.type = '#f00';
    }

    closestNotConnected(objects: Array<Pixel>){
        const closestFiltered = objects.filter(it=>(it instanceof PixelA_) && !this.connections.includes(it) && !it.connections.includes(this));
        const result = findClosest(this, closestFiltered);
        return result;
    }

    maxConnections(){
        return 3;
    }

    connectClosest(objects: Array<Pixel>){
        const closest = this.closestNotConnected(objects);
        const cnt = this.maxConnections();
        if (closest.original.connections.length <=closest.original.maxConnections() && this.connections.length<=cnt && closest.dist<this.connectingDist){
            if (!closest.original.connections.includes(this)){
                closest.original.connections.push(this);
            }
            if (!this.connections.includes(closest.original)){
                this.connections.push(closest.original);
            }
        }
    }

    breakConnections(){
        this.connections = this.connections.filter(it=> {
            const dist = ((it.position.x - this.position.x) ** 2 + (it.position.y - this.position.y) ** 2);
            if (dist>this.disconnectingDist){
                it.connections = it.connections.filter(jt=> jt!=it);
                return false;
            }
            return true;
        })
    }

    limitBorder(){
        if (this.position.x<0){ this.position.x = 0}
        if (this.position.x>=200){ this.position.x = 199}
        if (this.position.y<0){ this.position.y = 0}
        if (this.position.y>=200){ this.position.y = 199}
    }

    reactConnected(){
        const acc = springAcceleration(this.position, this.connections.map(it=>it.position), this.springDist);
        this.position.x += acc.x*6;
        this.position.y += acc.y*6;
    }

    react(objects: Array<Pixel>, map: Array<Array<Pixel>>){
        this.connectClosest(objects);
        this.breakConnections();
        this.reactConnected();
        const cnt = this.maxConnections();

        if (this.connections.length>=cnt){
            const acc = averageAcceleration(this.position, objects.filter(it=>it!=this && it instanceof PixelA && !this.connections.includes(it)).map(it=>it.position), 90);
            this.position.x += acc.x*3;
            this.position.y += acc.y*3;
        } else {
            const acc = averageAcceleration(this.position, objects.filter(it=>it!=this && it instanceof PixelA && !this.connections.includes(it)).map(it=>it.position), 10);
            this.position.x += acc.x*3;
            this.position.y += acc.y*3;
        }

        const acc1 = averageAcceleration(this.position, objects.filter(it=>it!=this && it instanceof PixelB).map(it=>it.position), 30);
        this.position.x += acc1.x* 2;
        this.position.y += acc1.y* 2;

        const acc2 = averageAcceleration(this.position, objects.filter(it=>it!=this && it instanceof PixelD).map(it=>it.position), 50);
        this.position.x += acc2.x*10;
        this.position.y += acc2.y*10;
       
        this.limitBorder();
    }
}

class PixelA extends PixelA_{

}

class PixelE extends PixelA_ {
    type: string = '#f90';
    connectingDist: number = 30;
    disconnectingDist: number = 150;
    springDist: number = 18;

    maxConnections(): number {
        return 2;
    }
}

class PixelB extends Pixel{
    position: IVector;
    attack: number = 0.1;
    
    constructor(position: IVector){
        super(position);
        this.type = '#ff0';
    }

    react(objects: Array<Pixel>, map: Array<Array<Pixel>>){
        this.attack+=0.01;
        const acc = averageAcceleration(this.position, objects.filter(it=>it!=this && it instanceof PixelB).map(it=>it.position), 50);
        this.position.x += acc.x * 0.1;
        this.position.y += acc.y * 0.1;
        //d
        const acc1 = averageAcceleration(this.position, objects.filter(it=>it!=this && it instanceof PixelA).map(it=>it.position), 5);
        this.position.x += acc1.x * 12;
        this.position.y += acc1.y * 12;
       
        if (this.position.x<0){ this.position.x = 0}
        if (this.position.x>=200){ this.position.x = 199}
        if (this.position.y<0){ this.position.y = 0}
        if (this.position.y>=200){ this.position.y = 199}
    }
}

class PixelD extends Pixel{
    position: IVector;
    attack: number = 0.1;
    
    constructor(position: IVector){
        super(position);
        this.type = '#f0f';
    }

    react(objects: Array<Pixel>, map: Array<Array<Pixel>>){
        this.attack+=0.01;
        const acc = averageAcceleration(this.position, objects.filter(it=>it!=this && it instanceof PixelD).map(it=>it.position), 5000);
        this.position.x += acc.x * 1;
        this.position.y += acc.y * 1;

        const acc1 = averageAcceleration(this.position, objects.filter(it=>it!=this && it instanceof PixelA).map(it=>it.position), 5);
        this.position.x += acc1.x * 0;
        this.position.y += acc1.y * 0;
       
        if (this.position.x<0){ this.position.x = 0}
        if (this.position.x>=200){ this.position.x = 199}
        if (this.position.y<0){ this.position.y = 0}
        if (this.position.y>=200){ this.position.y = 199}
    }
}


/*class PixelB extends Pixel{
    position: IVector;
    
    constructor(position: IVector){
        super(position)
        this.type = '#ff0';
    }

    react(objects: Array<Pixel>, map: Array<Array<Pixel>>){
        const closestPixels = closest.map(pos=> {
            const inbox = this.position.y + pos.y >=0 && this.position.y + pos.y<200 && this.position.x + pos.x >0 && this.position.x + pos.x<200
            const current = inbox ? map[this.position.y + pos.y][this.position.x + pos.x]: undefined;
            if (current === null) {
                return {position: pos}
            }

            if (current instanceof Pixel){
                return current
            }
        }).filter(it=>it);
        if (closestPixels.filter(it => it instanceof PixelB || it instanceof PixelA).length > 2){
            /*const empty = closestPixels.filter(it=>!(it instanceof Pixel));
            if (empty.length){
                const oneEmpty = empty[Math.floor(Math.random() * empty.length)];
                this.position = {x: this.position.x + oneEmpty.position.x, y: this.position.y + oneEmpty.position.y};
            }*/
     /*       const obj = objects.filter(it=>it!=this).map(it=> ({original: it, dist:((it.position.x - this.position.x) ** 2 + (it.position.y - this.position.y) ** 2)})).sort((a, b)=>a.dist-b.dist)[0];
            const empty = closestPixels.filter(it=>!(it instanceof Pixel));
            if (obj && empty.length){
                const oneEmpty = empty.map(it=>({original: it, dist:((it.position.x + this.position.x) - obj.original.position.x ) ** 2 + ((it.position.y + this.position.y) - obj.original.position.y ) ** 2})).sort((a, b)=>b.dist - a.dist)[0];
                this.position = {x: this.position.x + oneEmpty.original.position.x, y: this.position.y + oneEmpty.original.position.y};
            }
        } else {
            const obj = objects.filter(it=>it!=this).map(it=> ({original: it, dist:((it.position.x - this.position.x) ** 2 + (it.position.y - this.position.y) ** 2)})).sort((a, b)=>b.dist-a.dist)[0];
            const empty = closestPixels.filter(it=>!(it instanceof Pixel));
            if (obj && empty.length){
                const oneEmpty = empty.map(it=>({original: it, dist:((it.position.x + this.position.x) - obj.original.position.x ) ** 2 + ((it.position.y + this.position.y) - obj.original.position.y ) ** 2})).sort((a, b)=>a.dist - b.dist)[0];
                this.position = {x: this.position.x + oneEmpty.original.position.x, y: this.position.y + oneEmpty.original.position.y};
            }
        }
        if (this.position.x<0){ this.position.x = 0}
        if (this.position.x>=200){ this.position.x = 199}
        if (this.position.y<0){ this.position.y = 0}
        if (this.position.y>=200){ this.position.y = 199}
    }
}*/

class PixelC extends Pixel{
    position: IVector;
    
    constructor(position: IVector){
        super(position)
        this.type = '#f0f';
    }

    react(objects: Array<Pixel>, map: Array<Array<Pixel>>){
        const closestPixels = closest.map(pos=> {
            const inbox = this.position.y + pos.y >=0 && this.position.y + pos.y<200 && this.position.x + pos.x >0 && this.position.x + pos.x<200
            const current = inbox ? map[this.position.y + pos.y][this.position.x + pos.x]: undefined;
            if (current === null) {
                return {position: pos}
            }

            if (current instanceof Pixel){
                return current
            }
        }).filter(it=>it);
        if (closestPixels.filter(it => it instanceof Pixel).length > 3){
            /*const empty = closestPixels.filter(it=>!(it instanceof Pixel));
            if (empty.length){
                const oneEmpty = empty[Math.floor(Math.random() * empty.length)];
                this.position = {x: this.position.x + oneEmpty.position.x, y: this.position.y + oneEmpty.position.y};
            }*/
            const obj = objects.filter(it=>it!=this).map(it=> ({original: it, dist:((it.position.x - this.position.x) ** 2 + (it.position.y - this.position.y) ** 2)})).sort((a, b)=>a.dist-b.dist)[0];
            const empty = closestPixels.filter(it=>!(it instanceof Pixel));
            if (obj && empty.length){
                const oneEmpty = empty.map(it=>({original: it, dist:((it.position.x + this.position.x) - obj.original.position.x ) ** 2 + ((it.position.y + this.position.y) - obj.original.position.y ) ** 2})).sort((a, b)=>b.dist - a.dist)[0];
                this.position = {x: this.position.x + oneEmpty.original.position.x, y: this.position.y + oneEmpty.original.position.y};
            }
        } else {
            const obj = objects.filter(it=>it!=this).map(it=> ({original: it, dist:((it.position.x - this.position.x) ** 2 + (it.position.y - this.position.y) ** 2)})).sort((a, b)=>a.dist-b.dist)[0];
            //const obj = objects.filter(it=>it!=this && it instanceof PixelC).map(it=> ({original: it, dist:((it.position.x - this.position.x) ** 2 + (it.position.y - this.position.y) ** 2)})).sort((a, b)=>b.dist-a.dist).reduce((ac, it)=>ac+1/it.dist, 0);
            const empty = closestPixels.filter(it=>!(it instanceof Pixel));
            if (obj && empty.length){
                //const oneEmpty = empty.map(it=>({original: it, dist:((it.position.x + this.position.x) - obj.original.position.x ) ** 2 + ((it.position.y + this.position.y) - obj.original.position.y ) ** 2})).sort((a, b)=>a.dist - b.dist)[0];
                //this.position = {x: this.position.x + oneEmpty.original.position.x, y: this.position.y + oneEmpty.original.position.y};
            }
        }
        if (this.position.x<0){ this.position.x = 0}
        if (this.position.x>=200){ this.position.x = 199}
        if (this.position.y<0){ this.position.y = 0}
        if (this.position.y>=200){ this.position.y = 199}
    }
}

export interface IVector {
    x: number,
    y: number
}

export class Pixels{
    objects: Array<Pixel>;
    objectMap: Array<Array<Pixel>>;
    onGameState: ()=>void;
    constructor(){
        this.objects = new Array(200).fill(null).map((it, i)=> new [PixelA, PixelE, PixelB, PixelD][Math.floor(Math.random() * 4)]({x: Math.floor(Math.random() * 200  /*(i<100? 20: 150)*/), y: Math.floor(Math.random() *  200 )}));
        this.objects = this.objects.filter(it=>{
            return this.objects.find(jt=> it.position.x == jt.position.x && it.position.y == jt.position.y) != null;
        })
        this.objectMap = new Array(200).fill(null).map(row=> new Array(200).fill(null));
        this.objects.forEach(it=>{
            this.objectMap[it.position.y][it.position.x] = it;
        })
    }

    tick(){
        this.objects.forEach(it=> {
            const lastPos = {...it.position};
            it.react(this.objects, this.objectMap);
            /*this.objectMap[Math.floor(lastPos.y)][Math.floor(lastPos.x)] = null;
            this.objectMap[Math.floor(it.position.y)][Math.floor(it.position.x)] = it;*/
        });
        this.onGameState();
    }

    start(){
        const ticker = requestAnimationFrame(()=>{
            this.tick();
            this.start();
        });
        this.stop = ()=>{
            cancelAnimationFrame(ticker);
        }
    }

    stop(){
        
    }
}