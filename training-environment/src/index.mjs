import { CONFIG } from './config.mjs';
import { SocketIOServer } from './events/SocketIOServer.mjs';
import { AI } from './environment/AI.mjs';
import {Traffic} from './environment/Traffic.mjs'

const NUMBER_OF_SIMULATIONS = 1;

const infos = [];

function initTraffic(info) {
  return new Traffic(speed => info.speed = speed, pc => info.passedCars += pc);
}

function run() {
  const initialInfo = {
    speed: 1,
    passedCars: 0
  };
  const length = infos.push({...initialInfo});
  const index = length-1;

  const server = new SocketIOServer(index);
  server.onConnect(() => {
    server.sendEvent('config', CONFIG);
  });
  
  let traffic = initTraffic(infos[index]);
  let ai = new AI();
  ai.auto(traffic);
  
  setInterval(() => {
    traffic.simulate();
    console.clear();
    let string = infos.map(info => {
      const speedString = "Speed: " + info.speed;
      const passedCarsString = "Passed cars: " + info.passedCars;
      return `${speedString.padEnd(30, " ")} - ${passedCarsString.padEnd(20, " ")}`;
    }).join('\n');
    console.log(string);
    server.sendEvent('traffic', traffic);
    if(traffic.crashed) {
      infos[index] = {...initialInfo};
      traffic = initTraffic(infos[index]);
      ai.turnOffAutoMode();
      ai.auto(traffic);
    }
  }, 10);
}

for (let i = 0; i < NUMBER_OF_SIMULATIONS; i++) {
  run();
}
