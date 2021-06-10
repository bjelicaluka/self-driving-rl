import redis from "redis";

export class RedisPubSub {

  constructor() {
    this.subscriber = redis.createClient({
      password: '1234'
    });
    this.publisher = redis.createClient({
      password: '1234'
    });
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






