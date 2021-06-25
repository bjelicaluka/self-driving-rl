import { CONFIG } from "../config.mjs";
import { getRandomArbitraryNumber } from "../utils/functions.mjs";
import { Lane } from "./Lane.mjs";
import { Position } from "./structures/Position.mjs";

const {NUM_OF_LANES, LANE_WIDTH} = CONFIG;

export class LaneCreator {
    static createLanes = () => {
        const newLanes = [];
        for(let i = 0; i < NUM_OF_LANES; i++) {
            const lanePosition = LANE_WIDTH * (i + (i + 1)) / 2;
            const newLane = new Lane(new Position(lanePosition, 0), i, i * 0.05 * 0.9);
            newLanes.push(newLane);
        }
        return newLanes;
    }
}