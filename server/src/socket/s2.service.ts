import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
  import { from, Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Server } from 'ws';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class SocketGateway2 {
    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('events/s2')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
        console.log('event')
      return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }
  
    @SubscribeMessage('identity/s2')
    async identity(@MessageBody() data: number): Promise<number> {
      return data;
    }
  }