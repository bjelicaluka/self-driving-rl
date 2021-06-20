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

  static generateDirectionFeedback = (stateList, direction, nextStateList, crashed) => {
    const state = new State(stateList);
    const nextState = new State(nextStateList);

    let sum = 0;

    sum += nextState.speed;

    // -10 0
    // sum += crashed ? -10 : 0;

    const minValue = 0;
    const maxValue = 1;

    return Feedback.scaleFeedback(sum, minValue, maxValue);
  }

  static generateAccelerationFeedback = (stateList, acceleration, nextStateList, crashed) => {
    const state = new State(stateList);
    const nextState = new State(nextStateList);

    let sum = 0;

    // -10 1
    sum += crashed ? -10 : nextState.speed === 0 ? -5 : nextState.speed;

    const minValue = -10;
    const maxValue = 1;

    return Feedback.scaleFeedback(sum, minValue, maxValue);
  }


  static scaleFeedback(sum, minValue, maxValue) {
    return (sum - minValue) / (maxValue - minValue);
  }
}