import { Car } from "./Car.mjs";
import { Position } from "./structures/Position.mjs";
import { sleep } from "../utils/functions.mjs";
import { FrontSensor } from "./sensors/FrontSensor.mjs";
import { CollisionSensor } from "./sensors/CollisionSensor.mjs";
import { LeftSideSensor } from "./sensors/LeftSideSensor.mjs";
import { RightSideSensor } from "./sensors/RightSideSensor.mjs";
import { CONFIG } from "../config.mjs";

const { CANVAS_HEIGHT, MAX_SPEED, SAFETY_ZONE_ACTIVE } = CONFIG;

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

    this.safetySystemActive = SAFETY_ZONE_ACTIVE;
  }

  getSnapshot = () => {
    const speed = this.speed / MAX_SPEED;
    const frontSafetyActive = this.frontSensor.safetyZoneActive ? 1 : 0;
    const leftSideSafetyActive = this.leftSideSensor.safetyZoneActive ? 1 : 0;
    const rightSideSafetyActive = this.rightSideSensor.safetyZoneActive ? 1 : 0;

    const frontDistance = this.frontSensor.getNormalizedDistance();
    const leftSideDistance = this.leftSideSensor.getNormalizedDistance();
    const rightSideDistance = this.rightSideSensor.getNormalizedDistance();

    return [
      speed,
      frontSafetyActive,
      frontDistance,
      leftSideSafetyActive,
      leftSideDistance,
      rightSideSafetyActive,
      rightSideDistance
    ];
  }

  scanForCars = (cars) => {
    if(this.safetySystemActive && this.carInFront) {
      this.carInFront.speed = this.carInFront.previousSpeed;
      this.carInFront.speedAdjuster = speed => speed;
      this.carInFront = null;
    }
    this.frontSensor.setInitialValues();
    this.collisionSensor.setInitialValues();
    this.rightSideSensor.setInitialValues();
    this.leftSideSensor.setInitialValues();

    for (const i in cars) {
      const car = cars[i];
      const wasActive = this.frontSensor.safetyZoneActive;
      this.frontSensor.checkCar(car);
      this.collisionSensor.checkCar(car);
      if (!wasActive && this.frontSensor.safetyZoneActive && this.safetySystemActive) {
        this.carInFront = car;
        car.previousSpeed = car.speed;
        car.speedAdjuster = speed => this.speed
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
    if(!this.safetySystemActive) {
      if (direction === -1 && this.leftSideSensor.safetyZoneActive) {
        this.collisionSensor.safetyZoneActive = true;
      } else if (direction === 1 && this.rightSideSensor.safetyZoneActive) {
        this.collisionSensor.safetyZoneActive = true;
      }
    }
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
    return validLane && !this.transitioning && (!this.safetySystemActive || (canMoveLeft || canMoveRight));
  }

  animateLaneChange = async (oldPosition, newPosition) => {
    const frames = 5;
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
    this.leftSideSensor.setPosition(newPosition);
    this.rightSideSensor.setPosition(newPosition);
    this.collisionSensor.setPosition(newPosition);
  }
}