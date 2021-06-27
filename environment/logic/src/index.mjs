import { CONFIG } from './config.mjs';
import { SocketIOServer } from './events/SocketIOServer.mjs';
import { AI } from './AI.mjs';
import { Traffic } from './environment/Traffic.mjs';

const NUMBER_OF_SIMULATIONS = 2;

const initialInfo = {
  speed: 1,
  passedCars: 0,
  agentCalls: 0,
  avgPassedCars: 0,
  avgSpeed: 0,

  totalSpeed: 0,
  totalFramesInEpisode: 0,

  totalAvgSpeed: 0,
  totalPassedCars: 0,
  totalEpisodes: 0
};

const infos = [];

function initInfo() {
  const length = infos.push({...initialInfo});
  return length - 1;
}

function initTraffic(index) {
  infos[index] = {
    ...infos[index],
    passedCars: 0,
    agentCalls: 0
  };
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

function handleEpisodeEnd(index) {
  infos[index].totalAvgSpeed += infos[index].totalSpeed / infos[index].totalFramesInEpisode;
  infos[index].totalPassedCars += infos[index].passedCars;
  infos[index].totalEpisodes++;
  infos[index].avgPassedCars = infos[index].totalPassedCars / infos[index].totalEpisodes;
  infos[index].avgSpeed = infos[index].totalAvgSpeed / infos[index].totalEpisodes;

  infos[index].totalSpeed = 0;
  infos[index].totalFramesInEpisode = 0;
}

function updateSpeed(index) {
  infos[index].totalSpeed += infos[index].speed;
  infos[index].totalFramesInEpisode++;
}

function run() {
  const index = initInfo();
  const webSocketServer = initWebSocketServer(index);
  let traffic = initTraffic(index);
  const ai = new AI(index, traffic);

  setInterval(() => {
    webSocketServer.sendEvent('ping');
  }, 5000);

  setInterval(() => {
    // Run environment
    traffic.simulate();
    updateSpeed(index);

    // Call the agent
    const calledAgent = ai.think();
    if(calledAgent) infos[index].agentCalls += 1;

    // Emit event to frontend listeners
    webSocketServer.sendEvent('traffic', traffic);

    // Handle episode end
    if(traffic.done) {
      handleEpisodeEnd(index);
      traffic = initTraffic(index);
      ai.traffic = traffic;
      webSocketServer.sendEvent('episode_end');
    }
  }, 1);
}

function logInfo() {
  console.clear();
  const string = infos.map(info => {
    const speedString = "Speed: " + info.speed;
    const passedCarsString = "Passed cars: " + info.passedCars;
    const agentCallsString = "Agent calls: " + info.agentCalls;
    const avgPassedCarsString = "Avg Passed Cars: " + info.avgPassedCars;
    const avgSpeedString = "Avg Speed: " + info.avgSpeed;
    return `${speedString.padEnd(30, " ")} ${passedCarsString.padEnd(20, " ")} ${agentCallsString.padEnd(20)} ${avgPassedCarsString.padEnd(40)} ${avgSpeedString.padEnd(30)}`;
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
