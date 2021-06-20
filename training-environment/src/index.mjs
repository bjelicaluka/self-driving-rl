import { CONFIG } from './config.mjs';
import { SocketIOServer } from './events/SocketIOServer.mjs';
import { AI } from './AI.mjs';
import { Traffic } from './environment/Traffic.mjs';

const {CAR_SPAWN_SEQUENCE} = CONFIG;

const NUMBER_OF_SIMULATIONS = 4;

const initialInfo = {
  speed: 1,
  passedCars: 0,
  agentCalls: 0
};

const infos = [];

function initInfo() {
  const length = infos.push({...initialInfo});
  return length - 1;
}

function initTraffic(index) {
  infos[index] = {...initialInfo};
  const info = infos[index];
  return new Traffic(speed => info.speed = speed, pc => info.passedCars += pc);
}

function initWebSocketServer(index) {
  const webSocketServer = new SocketIOServer(index);
  webSocketServer.onConnect(() => {
    webSocketServer.sendEvent('config', CONFIG);
  });
  return webSocketServer;
}

function run() {
  const index = initInfo();
  const webSocketServer = initWebSocketServer(index);
  let traffic = initTraffic(index);
  const ai = new AI(index, traffic);

  let stoppedFrames = 0;

  setInterval(() => {
    // Run environment
    traffic.simulate();

    // Check if done
    const stopped = traffic.agent.speed === 0;
    if(stopped) {
      stoppedFrames += 1;
    } else {
      stoppedFrames = 0;
    }
    const done = stoppedFrames >= 400; // traffic.crashed; // || info.passedCars === CAR_SPAWN_SEQUENCE.length;

    // Call the agent
    const calledAgent = ai.think(done);
    if(calledAgent) infos[index].agentCalls += 1;

    // Emit event to frontend listeners
    webSocketServer.sendEvent('traffic', traffic);

    // Handle episode end
    if(done) {
      traffic = initTraffic(index);
      ai.traffic = traffic;
    }
  }, 1);
}

function logInfo() {
  console.clear();
  const string = infos.map(info => {
    const speedString = "Speed: " + info.speed;
    const passedCarsString = "Passed cars: " + info.passedCars;
    const agentCallsString = "Agent calls: " + info.agentCalls;
    return `${speedString.padEnd(30, " ")} - ${passedCarsString.padEnd(20, " ")} ${agentCallsString.padEnd(20)}`;
  }).join('\n');
  console.log(string);
}

function main() {
  for (let i = 0; i < NUMBER_OF_SIMULATIONS; i++) {
    run();
  }
  setInterval(logInfo, 1);
}

main();
