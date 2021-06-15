import { CONFIG } from "../config.mjs";

const {MAX_SPEED} = CONFIG;

class State {
  constructor(stateList) {
    this.speed = stateList[0] / MAX_SPEED;
    this.frontSensorSafetyZoneActive = !!stateList[1];
    this.frontSensorDistance = stateList[2];
    this.leftSideSensorSafetyZoneActive = !!stateList[3];
    this.leftSideSensorDistance = stateList[4];
    this.rightSideSensorSafetyZoneActive = !!stateList[5];
    this.rightSideSensorDistance = stateList[6];
  }
}

export class Feedback {

  static generateDirectionFeedback = (stateList, direction, nextStateList) => {
    const state = new State(stateList);
    const nextState = new State(nextStateList);

    let sum = 0;

    // 1 0 -1
    if(state.frontSensorSafetyZoneActive) {
      sum += direction !== 0 ? 1 : -5;
    }
    // 1 0 -1
    if(state.leftSideSensorSafetyZoneActive) {
      sum += direction !== -1 ? 1 : -5;
    }
    // 1 0 -1
    if(state.rightSideSensorSafetyZoneActive) {
      sum += direction !== 1 ? 1 : -5;
    }
    // 0.5 -1
    if(direction === 0) {
      const punishment = state.frontSensorDistance - 1;
      sum += punishment;
      // force staying in the same lane
      sum += punishment === 0 ? 0.5 : 0;
    } else if(direction === -1) {
      const punishment = state.leftSideSensorDistance - 1;
      sum += punishment;
    } else if(direction === 1) {
      const punishment = state.rightSideSensorDistance - 1;
      sum += punishment;
    }
    // sum += direction === 0 ? state.frontSensorDistance - 1 : 0.5;
    // sum += direction === -1 ? state.leftSideSensorDistance - 1 : 0.5;
    // sum += direction === 1 ? state.rightSideSensorDistance - 1 : 0.5;

    return sum;
    // const minValue = -4;
    // const maxValue = 3.5;

    // return Feedback.scaleFeedback(sum, minValue, maxValue);
  }

  static generateAccelerationFeedback = (stateList, acceleration, nextStateList) => {
    const state = new State(stateList);
    const nextState = new State(nextStateList);

    let sum = 0;

    // 1 0 -1
    if(state.frontSensorSafetyZoneActive) {
      sum += acceleration < 0 ? 5 : -5;
    }

    // 1 -1
    if(state.frontSensorDistance === 1) {
      sum += acceleration > 0 ? 1 : -1;
    } else {
      sum += acceleration < 0 ? 3 : (state.frontSensorDistance - 1) * 5;
    }

    return sum;
    // const minValue = -2;
    // const maxValue = 2;

    // return Feedback.scaleFeedback(sum, minValue, maxValue);
  }


  static scaleFeedback(sum, minValue, maxValue) {
    return (sum - minValue) / (maxValue - minValue);
  }
}