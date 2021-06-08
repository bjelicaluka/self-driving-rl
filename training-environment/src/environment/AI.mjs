import axios from 'axios'
import {CONFIG} from '../config.mjs'
import { Feedback } from './Feedback.mjs';

const {API_URL, CALL_FREQUENCY} = CONFIG;

export class AI {
    apiCallInterval = null;
    previousReward = 0;

    predict(state) {
        return axios.post(API_URL, {
            state,
            previous_reward: this.previousReward
        });
    }

    auto(traffic) {
        this.apiCallInterval = setInterval(() => {
            const input = [
                ...traffic.agent.getSnapshot()
            ];

            !traffic.agent.transitioning && this.predict(input)
            .then(resp => {
                const {action, acceleration} = resp.data;
                traffic.agent.changeLane(traffic.lanes, action);
                traffic.agent.acl = parseFloat(acceleration)*0.1 + 1;
                this.previousReward = Feedback.generateScalarFeedback(traffic);
            })
            .catch(err => {
                console.error(err);
            });
        }, CALL_FREQUENCY);
    }

    turnOffAutoMode() {
        clearInterval(this.apiCallInterval);
    }
}