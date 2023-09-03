import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  async getHello(@Req() req: Request){
    const token: string = req.headers['auth-token'].toString();
    const result = await this.appService.auth(token);
    return this.appService.getHello();
  }

  @Post('sign-in')
  signIn(){
    return this.appService.signIn();
  }

  @Post('auth')
  auth(@Req() req: Request){
    console.log(req.headers)
    const token: string = req.headers['auth-token'].toString();
    return this.appService.auth(token);
  }
}
