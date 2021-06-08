import { Car } from "./Car.mjs";
import { Position } from "./structures/Position.mjs";
import { sleep } from "../utils/functions.mjs";
import { CONFIG } from "../config.mjs";
import { PassingCarFrontSensor } from "./sensors/PassingCarFrontSensor.mjs";

const { CANVAS_HEIGHT } = CONFIG;

export class PassingCar extends Car {
  constructor(lane) {
    super(lane);
    this.transitioning = false;
    this.frontSensor = new PassingCarFrontSensor(this.position);

    this.carInFront = null;
  }

  scanForCars = (cars) => {
    this.carInFront = null;
    this.frontSensor.setInitialValues();
    if(this.carInFront) {
      if(this.frontSensor.safetyZoneActive) {
        this.carInFront.speed = this.speed;
        this.carInFront.speedAdjuster = this.speedAdjuster;
      } else {
        this.carInFront.speedAdjuster = speed => speed;
        this.carInFront = null;
        this.scanAllCars(cars);
      }
    } else {
      this.scanAllCars(cars);
    }
  }

  scanAllCars(cars) {
    for (const i in cars) {
      const car = cars[i];
      const wasActive = this.frontSensor.safetyZoneActive;
      this.frontSensor.checkCar(car);
      if (!wasActive && this.frontSensor.safetyZoneActive) {
        car.speed = this.speed;
        car.speedAdjuster = this.speedAdjuster;
        this.carInFront = car;
      }
    }
  }

  changeLane = (lanes, direction) => {
    const newLaneIndex = this.lane.laneNum + direction;
    if (this.canChangeLane(lanes, direction, newLaneIndex)) {
      this.lane = lanes[newLaneIndex]
      const newPosition = new Position(this.lane.position.x, CANVAS_HEIGHT * 0.875);
      this.animateLaneChange(this.position, newPosition);
    }
  }

  canChangeLane = (lanes, direction, newLaneIndex) => {
    const validLane = lanes[newLaneIndex];
    const canMoveLeft = direction === -1 && this.leftSideSensor.safetyZoneActive === false;
    const canMoveRight = direction === 1 && this.rightSideSensor.safetyZoneActive === false;
    return validLane && (canMoveLeft || canMoveRight) && !this.transitioning;
  }

  animateLaneChange = async (oldPosition, newPosition) => {
    const frames = 60;
    this.transitioning = true;
    for (let i = 0; i <= frames; i++) {
      const delta = i / frames;
      const dX = delta * (newPosition.x - oldPosition.x);
      const dY = delta * (newPosition.y - oldPosition.y);
      const deltaPosition = new Position(dX, dY);
      deltaPosition.add(oldPosition)
      this.updatePosition(deltaPosition);
      await sleep(1);
    }
    this.transitioning = false;
  }

  updatePosition = (newPosition) => {
    this.position = newPosition;
    this.frontSensor.setPosition(newPosition);
  }

}