import { CONFIG } from "../config.mjs";
import { Agent } from "./Agent.mjs";
import { PassingCar } from "./PassingCar.mjs";

const {CAR_CREATION_INTERVAL, CARS_TO_CREATE, NUM_OF_LANES, CAR_SPAWN_SEQUENCE, RANDOM_CAR_SPAWNING} = CONFIG;

export class CarCreator {
    constructor() {
        this.carCreationInterval = 1;
        this.isRandom = !!RANDOM_CAR_SPAWNING;
        this.sequence = [...CAR_SPAWN_SEQUENCE];

        this.currentSequence = [...CAR_SPAWN_SEQUENCE]
    }
    
    createCars = (lanes, cars) => {
        this.countdownCarCreation();

        const timeToCreateCar = this.carCreationInterval <= 0;
        const carIndex = cars.findIndex(car => car.position.y < 0);
        const canCreateCar = carIndex === -1;
        if(timeToCreateCar && canCreateCar) {
            const arr = [];
            while(arr.length < CARS_TO_CREATE) {
                const laneNum = this.getLaneNum();
                if(arr.indexOf(laneNum) === -1) arr.push(laneNum);
            }
            arr.forEach(laneNum => {
                const lane = lanes[laneNum];
                const newCar = new PassingCar(lane);
                cars.push(newCar);
            });
            this.resetCarCreation();
        }
    }

    getLaneNum = () => {
        if(this.isRandom) {
            const randomNum = Math.random();
            let randomLaneNum = Math.round((randomNum <= 0.0999 ? 0 : randomNum) * NUM_OF_LANES);
            if(randomLaneNum >= NUM_OF_LANES) 
                randomLaneNum = NUM_OF_LANES-1;
            return randomLaneNum;
        } else {
            const laneNum = this.currentSequence.pop();
            if(!this.currentSequence.length) {
                this.setInitialSequence()
            }
            return laneNum;
        }
    }

    setInitialSequence = () => {
        this.currentSequence = [...this.sequence];
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