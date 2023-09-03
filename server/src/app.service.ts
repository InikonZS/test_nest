import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.decorator';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService){

  }

  signIn(){
    const token = this.jwtService.sign({value:'test', roles: [Role.admin, Role.user]}, {
      expiresIn: 365 * 24 * 60 * 60
    });
    return token;
  }

  auth(token: string){
    const payload = this.jwtService.verify(token);
    return payload;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
