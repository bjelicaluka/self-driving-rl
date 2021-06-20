import { Sensor } from "./Sensor";
import {CONFIG} from "../config";

export class PassingCarFrontSensor extends Sensor {
    getSafetyZone() {
        const {LANE_WIDTH, CAR_HEIGHT} = CONFIG;
        const {x, y} = this.position;
        const xStart = x - LANE_WIDTH/2;
        const xEnd = x + LANE_WIDTH/2;
        const yStart = y - CAR_HEIGHT;
        const yEnd = y;
        return {xStart, xEnd, yStart, yEnd}
    }
}