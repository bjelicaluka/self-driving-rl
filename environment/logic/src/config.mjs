const NUMBER_OF_SIMULATIONS = 1;

const NUM_OF_LANES = 10;
const MAX_SPEED = 2;
const CARS_TO_CREATE = 2;
const CAR_CREATION_INTERVAL = 100;
const RANDOM_CAR_SPAWNING = false;
const SAFETY_ZONE_ACTIVE = false;

const NUM_OF_SEQUENCES_FOR_WIN = 3;
const CAR_SPAWN_SEQUENCE = 
  [0, 9, 3, 7, 
  2, 0, 4, 6,
  5, 8, 0, 1];

let windowWidth = 1024;
if (windowWidth <= 400) {
  windowWidth *= 0.9;
} else if (windowWidth >= 400 && windowWidth <= 765) {
  windowWidth *= 0.7;
} else {
  windowWidth *= 0.45;
}

export const CONFIG = {
  NUMBER_OF_SIMULATIONS,
  AGENT_CALL_FREQUENCY: 30,
  NO_PASSED_CARS_TIME_LIMIT: 1000,
  RANDOM_CAR_SPAWNING,
  SAFETY_ZONE_ACTIVE,
  NUM_OF_SEQUENCES_FOR_WIN,
  CAR_SPAWN_SEQUENCE,
  // Static fields.
  CAR_WIDTH: windowWidth * 0.0375,
  CAR_HEIGHT: windowWidth * 0.0625,
  CANVAS_HEIGHT: windowWidth,
  LANE_WIDTH: windowWidth * 0.1,
  MIN_SPEED: 1,
  // Relative fields.
  ACCELERATION: MAX_SPEED ? MAX_SPEED * 0.005 : 1.66 * 0.005,
  CANVAS_WIDTH: NUM_OF_LANES ? NUM_OF_LANES * windowWidth * 0.1 : windowWidth * 0.4,
  CAR_CREATION_INTERVAL: CAR_CREATION_INTERVAL ? CAR_CREATION_INTERVAL : 200,
  CARS_TO_CREATE: CARS_TO_CREATE ? CARS_TO_CREATE : 1,
  MAX_SPEED: MAX_SPEED ? MAX_SPEED : 1.66,
  NUM_OF_LANES: NUM_OF_LANES ? NUM_OF_LANES : 4,
}