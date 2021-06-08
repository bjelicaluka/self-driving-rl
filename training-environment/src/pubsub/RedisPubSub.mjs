import redis from "redis";

const subscriber = redis.createClient({
  password: '1234'
});
const publisher = redis.createClient({
  password: '1234'
});


async function publish() {
  const action = {
    action: -1,
    acceleration: 0.5
  };
  publisher.publish("state", JSON.stringify(state));
}

subscriber.on("message", (channel, data) => {
  console.log(JSON.parse(data));
});

subscriber.subscribe("action");