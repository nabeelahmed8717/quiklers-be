import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001', // Replace with the actual client origin or '*'
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string; // Assuming the user ID is passed in the query params
    if (userId) {
      client.join(userId); // Join a room named after the user's ID
    }
    console.log(`Client connected: ${client.id}, joined room: ${userId}`);
  }

  emitNewBooking(userId: string, booking: any) {
    this.server.to(userId).emit('new-booking', booking);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ): void {
    client.emit('response', `Server received: ${payload}`);
  }
}
