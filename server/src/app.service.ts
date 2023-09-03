import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.decorator';

@Injectable()
export class AppService {
  private users: Array<{login: string, password: string}> = [];
  constructor(private jwtService: JwtService){

  }

  signIn(data: {login: string, password: string}){
    const foundUser = this.users.find(user=> user.login == data.login);
    if (foundUser && foundUser.password == data.password){
      const token = this.jwtService.sign({name: foundUser.login, roles: [Role.admin, Role.user]}, {
        expiresIn: 365 * 24 * 60 * 60
      });
      return token;
    }
    throw new BadRequestException();
  }

  auth(token: string){
    const payload = this.jwtService.verify(token);
    return payload;
  }

  getHello(): string {
    return 'Hello World!';
  }

  register(data: {login: string, password: string}){
    this.users.push(data);
    return 'ok'
  }
}
