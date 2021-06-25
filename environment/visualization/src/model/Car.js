import {Size} from './structures/Size.js';
import {Position} from './structures/Position.js';
import {CONFIG} from "../config.js";

const {CAR_WIDTH, CAR_HEIGHT} = CONFIG;

export class Car {
    constructor(lane) {
        this.active = true;
        this.size = new Size(CAR_WIDTH, CAR_HEIGHT);
        this.position = new Position(lane.position.x, -100);
        this.lane = lane;
        this.direction = 1;
        this.speed = null;
        this.carIndex = 0;
    }
}