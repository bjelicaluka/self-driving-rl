import { io } from 'socket.io-client';

export class SocketIOClient {

  constructor(host, namespace) {
    this.client = io(`${host}${namespace}`, {
      forceNew: true,
      transports: ['websocket'],
    });

  }

  addEventListener(event, listener) {
    this.client.on(event, listener);
  }

  clearEventListeners(event) {
    this.client.off(event);
  }

  dispatchEvent(event, data) {
    this.client.emit(event, data);
  }

  close() {
    this.client.close();
  }

}