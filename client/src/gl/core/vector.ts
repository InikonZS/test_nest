export class Vector{
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number){
    this.x = x;
    this.y = y;
    this.z = z;
  }

  sub(x: number, y: number, z: number, self?: boolean){
    if (self){
      this.x -= x;  
      this.y -= y; 
      this.z -= z; 
      return this;
    }
    return new Vector(this.x-x, this.y-y, this.z-z);
  }

  subVector(v: { x: number; y: number; z: number; }, self?: boolean){
    if (self){
      this.x -= v.x;  
      this.y -= v.y; 
      this.z -= v.z; 
      return this;
    }
    return new Vector(this.x-v.x, this.y-v.y, this.z-v.z);  
  }

  add(x: number, y: number, z: number, self?: boolean){
    if (self){
      this.x += x;  
      this.y += y; 
      this.z += z; 
      return this;
    }
    return new Vector(this.x+x, this.y+y, this.z+z);
  }

  addVector(v: { x: number; y: number; z: number; }, self?: boolean){
    if (self){
      this.x += v.x;  
      this.y += v.y; 
      this.z += v.z; 
      return this;
    }
    return new Vector(this.x+v.x, this.y+v.y, this.z+v.z); 
  }

  mul(c: number, self?: boolean){
    if (self){
      this.x *= c;  
      this.y *= c; 
      this.z *= c; 
      return this;
    }
    return new Vector(this.x*c, this.y*c, this.z*c);
  }

  isPositive(){
    return (this.x>0)&&(this.y>0)&&(this.z>0);
  }

  abs(){
    return Math.hypot(this.x, this.y, this.z);
  }
}
