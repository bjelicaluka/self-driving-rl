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
        this.direction = 1;
        this.speed = null;
        this.carIndex = 0;

        this.speedAdjuster = speed => speed;
    }

    move = (speed) => {
        if(this.speed === null)
            this.speed = speed;
        if(this.active) {
            this.speed = this.speedAdjuster(this.speed);
            this.position.addY(this.speed * this.direction * (1 + this.lane.speedOffset))
            this.updatePosition(this.position);
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

    updatePosition = (newPosition) => {
        this.position = newPosition;
    }
}