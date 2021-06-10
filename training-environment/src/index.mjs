import { CONFIG } from './config.mjs';
import { SocketIOServer } from './events/SocketIOServer.mjs';
import { AI } from './AI.mjs';
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

  const webSocketServer = new SocketIOServer(index);
  webSocketServer.onConnect(() => {
    webSocketServer.sendEvent('config', CONFIG);
  });
  
  let traffic = initTraffic(infos[index]);
  let ai = new AI(index, traffic);
  
  setInterval(() => {
    // Run environment
    traffic.simulate();
    ai.think();
    webSocketServer.sendEvent('traffic', traffic);

    // Display speed and passed cars
    console.clear();
    let string = infos.map(info => {
      const speedString = "Speed: " + info.speed;
      const passedCarsString = "Passed cars: " + info.passedCars;
      return `${speedString.padEnd(30, " ")} - ${passedCarsString.padEnd(20, " ")}`;
    }).join('\n');
    console.log(string);

    // Handle episode end
    if(traffic.crashed) {
      ai.close();

      infos[index] = {...initialInfo};
      
      traffic = initTraffic(infos[index]);
      ai = new AI(index, traffic);
    }
  }, 1);
}

for (let i = 0; i < NUMBER_OF_SIMULATIONS; i++) {
  run();
}
