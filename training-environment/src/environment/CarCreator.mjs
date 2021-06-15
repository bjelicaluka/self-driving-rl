import { CONFIG } from "../config.mjs";
import { Agent } from "./Agent.mjs";
import { PassingCar } from "./PassingCar.mjs";

const {CAR_CREATION_INTERVAL, CARS_TO_CREATE} = CONFIG;

export class CarCreator {
    constructor() {
        this.carCreationInterval = 1;
    }
    
    createCars = (lanes, cars) => {
        this.countdownCarCreation();

        const timeToCreateCar = this.carCreationInterval === 0;
        if(timeToCreateCar) {
            const arr = [];
            while(arr.length < CARS_TO_CREATE){
                const randomNum = Math.random();
                let randomLaneNum = Math.round((randomNum <= 0.0999 ? 0 : randomNum) * lanes.length);
                if(randomLaneNum >= lanes.length) 
                    randomLaneNum = lanes.length-1;
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
        const agent = new Agent(lanes[5]);
        cars.push(agent);
        return agent;
    }
}