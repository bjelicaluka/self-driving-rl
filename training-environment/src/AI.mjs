import { CONFIG } from './config.mjs'
import { Feedback } from './environment/Feedback.mjs';
import { RedisPubSub } from './pubsub/RedisPubSub.mjs';

const { AGENT_CALL_FREQUENCY, MAX_SPEED } = CONFIG;

export class AI {

  constructor(episodeId, traffic) {
    this.episodeId = episodeId;
    this.traffic = traffic;

    this.apiCallInterval = AGENT_CALL_FREQUENCY;
    this.previousReward = 0;
    this.pubsub = new RedisPubSub();

    this.init();
  }

  think() {
    if (!this.traffic.agent.transitioning && !(--this.apiCallInterval >= 0)) {

      const state = this.traffic.agent.getSnapshot();
      const speedPercentage = this.traffic.speed / MAX_SPEED;

      this.pubsub.publish(`state_${this.episodeId}`, {
        state: [
          speedPercentage,
          ...state
        ]
      });
      this.apiCallInterval = AGENT_CALL_FREQUENCY;
      return true;
    }
    return false;
  }

  init() {
    this.pubsub.subscribe(`action_${this.episodeId}`, data => {
      const { direction, acceleration, state } = data;

      this.traffic.agent.changeLane(this.traffic.lanes, direction);
      this.traffic.agent.acl = parseFloat(acceleration) + 1;

      const speedPercentage = this.traffic.speed / MAX_SPEED;
      const nextState = [speedPercentage, ...this.traffic.agent.getSnapshot()];

      this.pubsub.publish(`feedback_${this.episodeId}`, {
        state,
        action: [
          direction + 1,
          acceleration * 1 + 0.5
        ],
        reward: [
          Feedback.generateDirectionFeedback(state, direction, nextState),
          Feedback.generateAccelerationFeedback(state, acceleration, nextState),
        ],
        next_state: nextState,
        crashed: this.traffic.crashed
      });
    });
    // this.traffic.onCrashed(send);
  }

  close() {
    this.pubsub.close();
  }

}