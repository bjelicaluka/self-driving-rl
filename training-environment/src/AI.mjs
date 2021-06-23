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

    this.prevData = null;

    this.init();
  }

  think() {
    if((!this.traffic.agent.transitioning && !(--this.apiCallInterval >= 0)) || this.traffic.done){

      const nextState = this.traffic.agent.getSnapshot();

      this.pubsub.publish(`state_${this.episodeId}`, {
        state: nextState,
        episode_id: this.episodeId
      });
      this.apiCallInterval = AGENT_CALL_FREQUENCY;

      if(this.prevData) {
        const { direction, acceleration, state } = this.prevData;

        this.pubsub.publish(`feedback_${this.episodeId}`, {
          state,
          action: [
            direction + 1,
            acceleration * 10 + 0.5
          ],
          reward: [
            Feedback.generateDirectionFeedback(state, direction, nextState, this.traffic),
            Feedback.generateAccelerationFeedback(state, acceleration, nextState, this.traffic),
          ],
          next_state: nextState,
          done: !!this.traffic.done,
          passed_cars: this.traffic.passedCars
        });
      }

      return true;
    }
    return false;
  }

  init() {
    this.pubsub.subscribe(`action_${this.episodeId}`, data => {
      const { direction, acceleration } = data;

      this.traffic.agent.changeLane(this.traffic.lanes, direction);
      this.traffic.agent.acl = parseFloat(acceleration) + 1;

      this.prevData = data;
    });
  }

  close() {
    this.pubsub.close();
  }

}