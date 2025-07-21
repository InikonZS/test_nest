export class KeyboardSystem {
    lastTimeStamp: number;
    onChangeState: ()=>void;

    constructor(){
       window.addEventListener('keydown', ()=>{});
    }
}