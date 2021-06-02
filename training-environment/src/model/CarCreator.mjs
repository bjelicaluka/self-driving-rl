import { CONFIG } from "../config.mjs";
import { Agent } from "./Agent.mjs";
import { PassingCar } from "./PassingCar.mjs";

const {CAR_CREATION_INTERVAL, CARS_TO_CREATE} = CONFIG;

export class CarCreator {
    constructor() {
        this.carCreationInterval = CAR_CREATION_INTERVAL;
    }
    
    createCars = (lanes, cars) => {
        this.countdownCarCreation();

        const timeToCreateCar = this.carCreationInterval === 0;
        if(timeToCreateCar) {
            const arr = [];
            while(arr.length < CARS_TO_CREATE){
                const randomLaneNum = Math.floor(Math.random() * lanes.length);
                if(arr.indexOf(randomLaneNum) === -1) arr.push(randomLaneNum);
            }
            arr.forEach(randomLaneNum => {
                const lane = lanes[randomLaneNum];
                const newCar = new PassingCar(lane);
                cars.push(newCar);
            });
            this.resetCarCreation();
        }
    }

    countdownCarCreation() {
        this.carCreationInterval --;
    }

    resetCarCreation() {
        this.carCreationInterval = CAR_CREATION_INTERVAL;
    }

    createAgent = (lanes, cars) => {
        const agent = new Agent(lanes[3]);
        cars.push(agent);
        return agent;
    }
}