import { Sensor } from "./Sensor";
import {CONFIG} from "../config";

export class FrontSensor extends Sensor {
    getSafetyZone() {
        const {CAR_HEIGHT, LANE_WIDTH} = CONFIG;
        const {x, y} = this.position;
        const xStart = x - LANE_WIDTH/2;
        const xEnd = x + LANE_WIDTH/2;
        const yStart = y - CAR_HEIGHT*2;
        const yEnd = y;
        return {xStart, xEnd, yStart, yEnd}
    }

    getDistanceZone() {
        const {CAR_HEIGHT, LANE_WIDTH} = CONFIG;
        const {x, y} = this.position;
        const xStart = x - LANE_WIDTH/2;
        const xEnd = x + LANE_WIDTH/2;
        const yStart = y - CAR_HEIGHT*10;
        const yEnd = y - CAR_HEIGHT*2;
        return {xStart, xEnd, yStart, yEnd}
    }
}