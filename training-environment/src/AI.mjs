import { CONFIG } from './config.mjs'
import { Feedback } from './environment/Feedback.mjs';
import { RedisPubSub } from './pubsub/RedisPubSub.mjs';

const { AGENT_CALL_FREQUENCY } = CONFIG;

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
      this.pubsub.publish(`state_${this.episodeId}`, {
        state,
        previous_reward: this.previousReward
      });

      this.apiCallInterval = AGENT_CALL_FREQUENCY;
    }

  }

  init() {
    this.pubsub.subscribe(`action_${this.episodeId}`, data => {
      const { action, acceleration } = data;

      this.traffic.agent.changeLane(this.traffic.lanes, action);
      this.traffic.agent.acl = parseFloat(acceleration) + 1;

      this.previousReward = Feedback.generateScalarFeedback(this.traffic);
    });
  }

  close() {
    this.pubsub.close();
  }

}