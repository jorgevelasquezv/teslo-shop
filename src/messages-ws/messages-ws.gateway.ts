import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessagesDto } from './dtos/new-messages.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const authentication: string = client.handshake.headers
      .authentication as string;

    const [bearer, token] = authentication.split(' ');

    if (bearer !== 'Bearer') {
      client.disconnect();
      return;
    }

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client);
  }

  @SubscribeMessage('message-form-client')
  handleMessageFormClient(client: Socket, payload: NewMessagesDto) {
    //! Emit the message to client that sent it
    // client.emit('message-from-server', {
    //   fullName: 'Your Name',
    //   message: payload.message || 'No message provided',
    // });

    //! Emit the message to other clients
    client.broadcast.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'No message provided',
    });

    //! Emit the message to all clients
    // this.wss.emit('message-from-server', {
    //   fullName: 'Your Name',
    //   message: payload.message || 'No message provided',
    // });
  }
}
