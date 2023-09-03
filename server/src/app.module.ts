import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './user.guard';
import { SocketGateway } from './socket/socket.service';
import { SocketGateway2 } from './socket/s2.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '60s' },
    })
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    SocketGateway,
    SocketGateway2,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
