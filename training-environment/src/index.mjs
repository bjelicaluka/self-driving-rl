import { AI } from './model/AI.mjs';
import {Traffic} from './model/Traffic.mjs'

const NUMBER_OF_SIMULATIONS = 1;

const infos = [];

function run() {
  const length = infos.push({
    speed: 1,
    passedCars: 0
  });
  const index = length-1;
  
  const traffic = new Traffic(speed => infos[index].speed = speed, pc => infos[index].passedCars += pc);
  AI.auto(traffic, true, () => {});
  
  setInterval(() => {
    traffic.simulate();
    console.clear();
    let string = infos.map(info => "Speed: " + info.speed + " - Passed cars: " + info.passedCars).join('\n');
    console.log(string);
  }, 1);
}


for (let i = 0; i < NUMBER_OF_SIMULATIONS; i++) {
  run();
}
