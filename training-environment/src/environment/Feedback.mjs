import { CONFIG } from "../config.mjs";

export class Feedback {

  static generateScalarFeedback = (traffic) => {
    const maximumFeedbackValue = 100 + 100;
    const minimumFeedbackValue = -100 -300 -200 -100;
    // Distance from the nearest facing car - Front Sensor distance zone length in % === Maximizing [-100, 0]
      const distancePercentage = -(traffic.agent.frontSensor.getNormalizedDistance() * 100);
    // Current Speed in % of Max Allowed Speed === Maximizing [0, 100]
      const speedPercentage = ((traffic.speed * 100) / CONFIG.MAX_SPEED)
    // Speed - Distance difference [-200, 100]
      const speedDistanceDiff = (speedPercentage + distancePercentage)
    // Is car in the front sensor safety zone === Minimizing {0, [0, -300]}
      const frontSensorSafetyZone = traffic.agent.frontSensor.safetyZoneActive ? -3 * speedPercentage : 0;
    // Has Crashed === Minimizing -100 {0, -100}
      const hasCrashed = traffic.agent.collisionSensor.safetyZoneActive ? -100 : 0;
    // NOT YET - because it's not the result of one particular action, maybe add some points to all of the actions from the episode
      // Has Finished === Maximizing +20 {0, +20}
    const sum = [
      speedPercentage,
      distancePercentage,
      speedDistanceDiff,
      frontSensorSafetyZone,
      hasCrashed,
    ].reduce((acc, curr) => acc + curr, 0);
    return (sum + minimumFeedbackValue * -1) / (maximumFeedbackValue + minimumFeedbackValue * -1);
  }

}