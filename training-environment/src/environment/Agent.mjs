import { Car } from "./Car.mjs";
import { Position } from "./structures/Position.mjs";
import { sleep } from "../utils/functions.mjs";
import { FrontSensor } from "./sensors/FrontSensor.mjs";
import { CollisionSensor } from "./sensors/CollisionSensor.mjs";
import { LeftSideSensor } from "./sensors/LeftSideSensor.mjs";
import { RightSideSensor } from "./sensors/RightSideSensor.mjs";
import { CONFIG } from "../config.mjs";

const { CANVAS_HEIGHT } = CONFIG;

export class Agent extends Car {
  constructor(lane) {
    super(lane);
    this.position = new Position(lane.position.x, CANVAS_HEIGHT * 0.875);
    this.speed = 0;
    this.acl = 2;
    this.transitioning = false;
    this.frontSensor = new FrontSensor(this.position);
    this.leftSideSensor = new LeftSideSensor(this.position);
    this.rightSideSensor = new RightSideSensor(this.position);
    this.collisionSensor = new CollisionSensor(this.position);

    this.isAgent = true;
    this.carInFront = null;
  }

  getSnapshot = () => {
    const frontSafetyActive = this.frontSensor.safetyZoneActive ? 1 : 0;
    const leftSideSafetyActive = this.leftSideSensor.safetyZoneActive ? 1 : 0;
    const rightSideSafetyActive = this.rightSideSensor.safetyZoneActive ? 1 : 0;

    const frontDistance = this.frontSensor.getNormalizedDistance();
    const leftSideDistance = this.leftSideSensor.getNormalizedDistance();
    const rightSideDistance = this.rightSideSensor.getNormalizedDistance();

    return [
      frontSafetyActive,
      frontDistance,
      leftSideSafetyActive,
      leftSideDistance,
      rightSideSafetyActive,
      rightSideDistance
    ];
  }

  scanForCars = (cars) => {
    this.carInFront = null;
    this.frontSensor.setInitialValues();
    this.collisionSensor.setInitialValues();
    this.rightSideSensor.setInitialValues();
    this.leftSideSensor.setInitialValues();

    for (const i in cars) {
      const car = cars[i];
      const wasActive = this.frontSensor.safetyZoneActive;
      this.frontSensor.checkCar(car);
      this.collisionSensor.checkCar(car);
      if (!wasActive && this.frontSensor.safetyZoneActive) {
        this.carInFront = car;
      } else {
        car.speedAdjuster = speed => speed;
      }

      this.rightSideSensor.checkCar(car);
      this.rightSideSensor.scanForLaneEdges(this.lane.laneNum);

      this.leftSideSensor.checkCar(car);
      this.leftSideSensor.scanForLaneEdges(this.lane.laneNum);
    }
  }

  changeLane = (lanes, direction) => {
    const newLaneIndex = this.lane.laneNum + direction;
    if (direction === -1 && this.leftSideSensor.safetyZoneActive) {
      this.collisionSensor.safetyZoneActive = true;
    } else if (direction === 1 && this.rightSideSensor.safetyZoneActive) {
      this.collisionSensor.safetyZoneActive = true;
    }
    if (this.canChangeLane(lanes, newLaneIndex)) {
      this.lane = lanes[newLaneIndex]
      const newPosition = new Position(this.lane.position.x, CANVAS_HEIGHT * 0.875);
      this.updatePosition(newPosition);
    }
  }

  canChangeLane = (lanes, newLaneIndex) => {
    const validLane = lanes[newLaneIndex];
    if(!validLane) {
      this.collisionSensor.safetyZoneActive = true;
    }
    return validLane && !this.transitioning;
  }

  updatePosition = (newPosition) => {
    this.position = newPosition;
    this.frontSensor.setPosition(newPosition);
    this.leftSideSensor.setPosition(newPosition);
    this.rightSideSensor.setPosition(newPosition);
    this.collisionSensor.setPosition(newPosition);
  }
}