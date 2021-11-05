import redis from "redis";
import { REDIS_CONFIG } from "../config.mjs";

export class RedisPubSub {

  constructor() {
    this.subscriber = redis.createClient(REDIS_CONFIG);
    this.publisher = redis.createClient(REDIS_CONFIG);
  }

  publish(channel, data) {
    this.publisher.publish(channel, JSON.stringify(data));
  }

  subscribe(channel, handler) {
    this.subscriber.on("message", (channel, data) => handler(JSON.parse(data)));
    this.subscriber.subscribe(channel);
  }

  close() {
    this.publisher.quit();
    this.subscriber.quit();
  }

}






