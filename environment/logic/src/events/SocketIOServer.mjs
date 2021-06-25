import express from 'express';
const app = express();
import http from 'http'
const server = http.createServer(app);
import { Server } from 'socket.io';

const io = new Server(server);

server.listen(4001, () => {
  console.log('Started listening.');
});

export class SocketIOServer {
  constructor(id) {
    this.io = io.of(id);
    this.connectCallback = () => {}

    this.io.on('connection', (socket) => {
      console.log('New connection');
      this.connectCallback();

      socket.on('disconnect', () => console.log('Client disconnected'));
    });
  }

  onConnect(connectCallback) {
    this.connectCallback = connectCallback;
  }

  sendEvent(key, data) {
    this.io.emit(key, data);
  }
}