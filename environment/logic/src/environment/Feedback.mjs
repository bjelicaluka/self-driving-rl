import { CONFIG } from "../config.mjs";

const { NUM_OF_SEQUENCES_FOR_WIN, CAR_SPAWN_SEQUENCE, MAX_SPEED } = CONFIG;

class State {
  constructor(stateList) {
    this.speed = stateList[0];
    this.frontSensorSafetyZoneActive = !!stateList[1];
    this.frontSensorDistance = stateList[2];
    this.leftSideSensorSafetyZoneActive = !!stateList[3];
    this.leftSideSensorDistance = stateList[4];
    this.rightSideSensorSafetyZoneActive = !!stateList[5];
    this.rightSideSensorDistance = stateList[6];
  }
}

export class Feedback {

  static generateDirectionFeedback = (stateList, direction, nextStateList, traffic) => {
    const state = new State(stateList);
    const nextState = new State(nextStateList);

    const maxPassedCars = NUM_OF_SEQUENCES_FOR_WIN * CAR_SPAWN_SEQUENCE.length;

    let sum = 0;

    // 0 (maxPassedCars * maxSpeed)
    sum += traffic.crashed ? traffic.avgSpeed * traffic.passedCars : 0;
    // 0 1
    const wonAward = 1;
    sum += traffic.won ? wonAward : 0;

    const maxValue = 0 + maxPassedCars * MAX_SPEED + wonAward;
    const minValue = 0;

    return Feedback.scaleFeedback(sum, minValue, maxValue);
  }

  static generateAccelerationFeedback = (stateList, acceleration, nextStateList, traffic) => {
    const state = new State(stateList);
    const nextState = new State(nextStateList);

    const maxPassedCars = NUM_OF_SEQUENCES_FOR_WIN * CAR_SPAWN_SEQUENCE.length;

    let sum = 0;

    // -1 0
    const stopPunishment = -1;
    sum += traffic.stopped ? stopPunishment : 0;
    // 0 (maxPassedCars * maxSpeed)
    sum += traffic.crashed ? traffic.avgSpeed * traffic.passedCars : 0;
    // 0 1
    const wonAward = 1;
    sum += traffic.won ? wonAward : 0;

    const maxValue = 0 + maxPassedCars * MAX_SPEED + wonAward;
    const minValue = stopPunishment + 0;

    return Feedback.scaleFeedback(sum, minValue, maxValue);
  }


  static scaleFeedback(sum, minValue, maxValue) {
    return ((sum - minValue) / (maxValue - minValue));
  }
}