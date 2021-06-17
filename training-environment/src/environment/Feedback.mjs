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

  getTotalDistance() {
    return this.frontSensorDistance + this.leftSideSensorDistance + this.rightSideSensorDistance;
  }
}

export class Feedback {

  static generateDirectionFeedback = (stateList, direction, nextStateList, crashed) => {
    const state = new State(stateList);
    const nextState = new State(nextStateList);

    let sum = 0;

    // -5 0
    sum += crashed ? -5 : 0;

    const minValue = -5;
    const maxValue = 0;

    return Feedback.scaleFeedback(sum, minValue, maxValue);
  }

  static generateAccelerationFeedback = (stateList, acceleration, nextStateList, crashed) => {
    const state = new State(stateList);
    const nextState = new State(nextStateList);

    let sum = 0;

    // 0 1
    // const isMaxSpeed = state.speed === nextState.speed && state.speed === 1;
    // sum += !isMaxSpeed && nextState.speed - state.speed;

    // -5 1
    sum += crashed ? -8 : nextState.speed === 0 ? -4 : nextState.speed;

    const minValue = -8;
    const maxValue = 1;

    return Feedback.scaleFeedback(sum, minValue, maxValue);
  }


  static scaleFeedback(sum, minValue, maxValue) {
    return (sum - minValue) / (maxValue - minValue);
  }
}