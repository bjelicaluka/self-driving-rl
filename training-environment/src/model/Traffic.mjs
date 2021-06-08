import { MovementSimulator } from "./MovementSimulator.mjs";
import { CarCreator } from "./CarCreator.mjs";
import { LaneCreator } from "./LaneCreator.mjs";
import {CONFIG} from "../config.mjs";

const {MAX_SPEED, NO_PASSED_CARS_TIME_LIMIT} = CONFIG;

export class Traffic {
    constructor(changeSpeed, updatePassedCars) {
        this.lanes = LaneCreator.createLanes();
        
        this.cars = [];
        this.carCreator = new CarCreator();
        this.agent = this.carCreator.createAgent(this.lanes, this.cars);

        this.updateSpeedState = changeSpeed;
        this.updatePassedCarsState = updatePassedCars;
        this.speed = 1;
        this.crashed = false;
        this.passedCars = 0;
        this.noPassedCarsTimeLimit = NO_PASSED_CARS_TIME_LIMIT;
    }

    changeSpeed = (speed) => {
        if(speed > MAX_SPEED) {
            speed = MAX_SPEED;
        }
        if(speed < 0) {
            speed = 0;
        }
        this.speed = speed;
        this.updateSpeedState(speed);
    }

    simulate = () => {
        if(this.agent.collisionSensor.safetyZoneActive || --this.noPassedCarsTimeLimit <= 0) {
            this.crashed = true;
        }
        if(!this.crashed) {
            this.createCars();
            this.moveCars();
            this.removePassedCars();
        }
    }

    createCars = () => {
        this.carCreator.createCars(this.lanes, this.cars);
    }

    moveCars = () => {
        MovementSimulator.simulateMovement(this.cars, this.changeSpeed, this.speed);
    }

    removePassedCars = () => {
        const previousCarNum = this.cars.length;
        this.cars = MovementSimulator.removeCarsOutOfSight(this.cars);
        const currentCarNum = this.cars.length;
        const removedCars = previousCarNum - currentCarNum;
        this.updatePassedCarsState(removedCars);
        this.passedCars += removedCars;
        this.noPassedCarsTimeLimit = NO_PASSED_CARS_TIME_LIMIT;
    }
}