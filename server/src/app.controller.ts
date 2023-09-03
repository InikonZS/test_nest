import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { Role, Roles } from './roles.decorator';
import { UserInfo } from './user.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @Roles(Role.user, Role.admin)
  async getHello(@Req() req: Request, @UserInfo() user: any){
    console.log('user', user);
    return JSON.stringify({data: this.appService.getHello(), user: user.name});
  }

  @Post('sign-in')
  signIn(@Body() body: {login: string, password: string}){
    return this.appService.signIn(body);
  }

  @Post('auth')
  auth(@Req() req: Request){
    console.log(req.headers)
    const token: string = req.headers['auth-token'].toString();
    return this.appService.auth(token);
  }

  @Post('register')
  register(@Body() body: {login: string, password: string}){
    console.log(body)
    return this.appService.register(body);
  }
}
