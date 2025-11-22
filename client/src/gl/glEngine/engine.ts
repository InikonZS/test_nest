class Engine {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext | null;
    children: Array<EngineNode>;
    
    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl');
    }

    addNode(node: EngineNode){
        node.handleAdd(this);
        this.children.push(node);
    }

    removeNode(node: EngineNode){
        node.handleRemove(this);
        this.children.filter(child => child != node);
    }
}

class EngineNode {
    engine: Engine | null = null;

    constructor(){

    }

    handleAdd(engine: Engine){
        this.engine = engine;
        if (!this.engine){
            throw new Error();
        }
    }

    handleRemove(engine: Engine){
        this.engine = null;
    }
}

class TickerEngineNode extends EngineNode{
    children: Array<any>;
    lastTimeStamp: number;

    constructor(){
        super();
        this.lastTimeStamp = Date.now();
        requestAnimationFrame((timeStamp)=>this.render(timeStamp));
    }

    handleAdd(engine: Engine): void {
        super.handleAdd(engine);
    }

    addNode(node: any){
        node.handleAdd(this);
        this.children.push(node);
    }

    removeNode(node: any){
        node.handleRemove(this);
        this.children.filter(child => child != node);
    }

    render(timeStamp: number){
        this.children.forEach(child=>{
            child.render(timeStamp);
        });

        this.lastTimeStamp = timeStamp;
        requestAnimationFrame((timeStamp)=>this.render(timeStamp));
    }
}

class KeyboardEngineNode extends EngineNode{
    children: Array<any>;
    lastTimeStamp: number;

    constructor(){
        super();
    }

    handleAdd(engine: Engine): void {
        super.handleAdd(engine);
        window.addEventListener('keydown', (e)=>{
            console.log(e);
        });
    }

    addNode(node: any){
        node.handleAdd(this);
        this.children.push(node);
    }

    removeNode(node: any){
        node.handleRemove(this);
        this.children.filter(child => child != node);
    }
}

class UserComponent{

}

const usage = ()=>{
    const canvas = document.createElement('canvas');
    const engine = new Engine(canvas);
    const tickerEngineNode = new TickerEngineNode();
    engine.addNode(tickerEngineNode);
    const keyboardEngineNode = new KeyboardEngineNode();
    engine.addNode(keyboardEngineNode);
}