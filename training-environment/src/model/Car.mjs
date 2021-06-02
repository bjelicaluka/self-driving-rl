import {Size} from './structures/Size.mjs';
import { Position } from './structures/Position.mjs';
import {CONFIG} from "../config.mjs";

const {CAR_WIDTH, CAR_HEIGHT} = CONFIG;

export class Car {
    constructor(lane) {
        this.active = true;
        this.size = new Size(CAR_WIDTH, CAR_HEIGHT);
        this.position = new Position(lane.position.x, -100);
        this.lane = lane;
        this.lane.speed = null
        this.direction = 1;
        this.speed = null;
        this.carIndex = 0;

        this.speedAdjuster = speed => speed;
    }

    move = (speed) => {
        if(this.lane.speed === null)
            this.lane.speed = speed;
        if(this.active) {
            this.lane.speed = this.speedAdjuster(this.lane.speed + this.lane.speedOffset * 0.1);
            this.position.addY(this.lane.speed * this.direction);
        }
    }

    toggle = () => {
        if(this.active) {
            this.speed = 0;
            this.active = false;
        } else {
            this.active = true;
        }
    }
}