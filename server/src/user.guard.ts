import { Injectable, CanActivate, ExecutionContext, HttpException, ForbiddenException, createParamDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.userInfo;
  },
);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
        ]);
        if (!requiredRoles) {
        return true;
        }
        const request = context.switchToHttp().getRequest();
        const token: string = request.headers['auth-token'].toString();
        const payload = this.jwtService.verify(token);
        request.userInfo = payload;
        const result = requiredRoles.some((role) => payload.roles?.includes(role));
        return result;
    } catch(e){
        throw new ForbiddenException()
    }
  }
}