import { SocketIOClient } from "./SocketIOClient";

export class TrafficEventHandler extends SocketIOClient {

  constructor(id) {
    super(`http://localhost:4001`, id);

    this.addEventListener('connect', () => {
      console.log("Connected to Traffic live emitter.");
    });
    this.addEventListener('disconnect', () => {
      console.log("Disconnected from Traffic live emitter.");
    });
    this.addEventListener('connect_error', (e) => {
      console.log(e);
    });
  }

  onTraffic(trafficHandler) {
    this.addEventListener('traffic', trafficHandler);
  }

  onEpisodeEnd(episodeEndHandler) {
    this.addEventListener('episode_end', episodeEndHandler);
  }

  onPing(pingHandler) {
    this.addEventListener('ping', pingHandler);
  }

  onConfig(configHandler) {
    this.addEventListener('config', configHandler);
  }
}