import { Sensor } from "./Sensor.mjs";
import { CONFIG } from "../config.mjs";

const {CAR_WIDTH, CAR_HEIGHT} = CONFIG;

export class CollisionSensor extends Sensor {

    getSafetyZone() {
        const {x, y} = this.position;
        const xStart = x - CAR_WIDTH/2;
        const xEnd = x + CAR_WIDTH/2;

        const yStart = y;
        const yEnd = y + CAR_HEIGHT*2;
        return {yStart, yEnd, xStart, xEnd}
    }
}