import { Car } from "./Car.js";
import { Position } from "./structures/Position.js";
import { FrontSensor } from "../sensors/FrontSensor.js";
import { CollisionSensor } from "../sensors/CollisionSensor.js";
import { LeftSideSensor } from "../sensors/LeftSideSensor.js";
import { RightSideSensor } from "../sensors/RightSideSensor.js";
import {CONFIG} from "../config.js";

const {CANVAS_HEIGHT} = CONFIG;

export class Agent extends Car {
    constructor(lane) {
        super(lane);
        this.position = new Position(lane.position.x, CANVAS_HEIGHT * 0.875);
        this.speed = 0;
        this.acl = 1;
        this.transitioning = false;
        this.frontSensor = new FrontSensor(this.position);
        this.leftSideSensor = new LeftSideSensor(this.position);
        this.rightSideSensor = new RightSideSensor(this.position);
        this.collisionSensor = new CollisionSensor(this.position);

        this.isAgent = true;
        this.carInFront = null;
    }
}