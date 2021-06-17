import { CONFIG } from "../config.mjs";
import { Agent } from "./Agent.mjs";

const {CANVAS_HEIGHT, MAX_SPEED} = CONFIG;

export class MovementSimulator {
    static simulateMovement = (cars, setSpeed, speed) => {
        for(let i = 0; i < cars.length; i++) {
            const currentCar = cars[i];
            if(currentCar instanceof Agent) {
                const agent = currentCar;
                agent.scanForCars(cars);

                this.adjustSpeed(agent, speed, setSpeed);
            } else {
                currentCar.scanForCars(cars);

                currentCar.move(speed);
            }
        }
    }

    // static adjustSpeed = (agent, speed, setSpeed) => {
    //     const brakingSpeed = 100;
    //     agent.speed = speed;
    //     if(agent.frontSensor.safetyZoneActive) {
    //         if(speed > 0.1) {
    //             setSpeed(speed * (1 - 0.001 * brakingSpeed * MAX_SPEED));
    //         } else {
    //             setSpeed(0);
    //         }
    //     } else {
    //         if(speed < 0.1) {
    //             setSpeed(speed + 0.05);
    //         } else {
    //             setSpeed(speed + 0.05/speed);
    //         }
    //     }

    //     const carCrashed = agent.collisionSensor.safetyZoneActive;
    //     if(carCrashed) {
    //         setSpeed(0);
    //     }
    // }
    static adjustSpeed = (agent, speed, setSpeed) => {
        const acl = agent.acl;
        agent.speed = speed;
        
        const speedAdjuster = speed => speed < 0.1 ? speed + acl - 1 : speed * acl;
        setSpeed(speedAdjuster(speed));

        const carCrashed = agent.collisionSensor.safetyZoneActive;
        if(carCrashed) {
            setSpeed(0);
        }
    }

    static removeCarsOutOfSight = (cars) => {
        return cars.filter(this.carOutOfSight);
    }

    static carOutOfSight = (currentCar) => {
        return currentCar.position.y < CANVAS_HEIGHT;
    }
    
}