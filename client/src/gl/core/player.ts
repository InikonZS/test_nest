import { Noisy } from "./noisy";
import { Vector } from "./vector";

export class Player{
  posX: number;
  posY: number;
  posZ: number;
  camRX: number;
  camRY: number;
  forward: boolean;
  tryJump: boolean;
  onFloor: boolean;
  alive: boolean;
  gravSpeed: number;
  moveSpeed: number;

  constructor(){
    //this.gl = gl; 
  }
  getPosVector(){
    return new Vector(-this.posX, -this.posY, - this.posZ);
    //return new Vector(this.posX, this.posY, this.posZ);
  }
  spawn(){
    this.camRX=0;
    this.camRY=0;
    this.posX=-2;
    this.posY=-2;
    this.posZ = -30;
    this.forward = false;
    this.tryJump = false;  
    this.onFloor = false;
    this.alive = true;

    this.gravSpeed = -15;
    this.moveSpeed = 15;
  }

  rotateCam(dx: number, dy: number){
    this.camRX += dx / 100;
    this.camRY += dy / 100;
    if (this.camRY>0){ this.camRY=0 }
    if (this.camRY<-Math.PI){ this.camRY=-Math.PI}
  }

  render(){

  }

  moveForward(){

  }

  react(obj: { reactLine: (arg0: Vector, arg1: Vector) => any; }, vx: { add: (arg0: number, arg1: number, arg2: number) => any; }){
    return (obj.reactLine(new Vector(-this.posX, -this.posY, -this.posZ-3),vx.add(this.posX,this.posY,this.posZ)));   
  }

  procMoves(world: Noisy, deltaTime: number, /*obj: { reactLine: any; }*/){
    if (!world){
        return;
    }
    this.gravSpeed>-15? this.gravSpeed -= 0.6 : this.gravSpeed = -15;

    let nz = this.posZ - (this.gravSpeed * deltaTime);
    //let poi = (obj.reactLine(new Vector(-this.posX, -this.posY, -this.posZ-2),(new Vector(-this.posX, -this.posY, -nz-2)).add(this.posX,this.posY,this.posZ)));
   // if (poi){this.gravSpeed+=0.1; this.posZ=poi.z}
      if (world.react(new Vector(-this.posX, -this.posY, -nz-3))/*||(poi)*/){  //(inBoxA(-this.posX, -this.posY, -nz-2)){
        this.onFloor = true;
      } else {
        this.posZ = nz;
        this.onFloor = false;
      }

      if (world.react(new Vector(-this.posX, -this.posY, -nz-3+3)))/*||this.react(obj,new Vector(-this.posX, -this.posY, -nz-2+3)))*/{ 
        this.gravSpeed = -15;
      }

      if (this.tryJump){
        if (this.onFloor){
          this.gravSpeed = 15;
          this.onFloor = false;
          
        }
        this.tryJump =false;
      }

      if (this.forward){
        let ny = this.posY - (this.moveSpeed * deltaTime)* Math.cos(this.camRX);
        let nx = this.posX - (this.moveSpeed * deltaTime)* Math.sin(this.camRX);
        

        if (!world.react(new Vector(-nx, -ny, -this.posZ-3))//&&(!this.react(obj,new Vector(-nx, -ny, -this.posZ-2)))
        ){//(!inBoxA(-nx, -ny, -this.posZ-2)){
          this.posY = ny;
          this.posX = nx;
        } else {
          if (!world.react(new Vector(-this.posX, -ny, -this.posZ-3))
            //&&(!this.react(obj,new Vector(-this.posX, -ny, -this.posZ-2)))
        ){// (!inBoxA(-this.posX, -ny, -this.posZ-2)){
            this.posY = ny;
          } else {
            if (!world.react(new Vector(-nx, -this.posY, -this.posZ-3))//&&(!this.react(obj,new Vector(-nx, -this.posY, -this.posZ-2)))){///(!inBoxA(-nx, -this.posY, -this.posZ-2)
            ){
              this.posX = nx;
            } else {
              //this.posZ-=0.1;
              //this.onFloor=false;  
            }    
          }  
        }

      }
  }
}