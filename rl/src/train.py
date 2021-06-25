from threading import Thread
import numpy as np
import json
import matplotlib.pyplot as plt

from src.pubsub import RedisPubSub
from src.replay_buffer import ReplayBuffer
from src.model import ModelInstanceProvider, Model


global ep, total_reward, total_frames
ep = 0
total_reward = 0
total_frames = 0
num_of_simulations = 1
gamma = 0.99
batch_size = 32
final_rewards = []
avg_rewards = []


def handle_feedback(data):
    global ep, total_reward, total_frames
    state = data['state']
    action = data['action']
    reward = data['reward']
    next_state = data['next_state']
    terminal = 0 if data['done'] else 1

    buffer.add(state[1:7], action, reward, next_state[1:7], terminal)

    states, actions, rewards, next_states, terminals = buffer.get_batch(batch_size)

    actions = actions.reshape(len(actions), 2)

    q_state = q_model.predict(states)
    q_next_state = target_model.predict(next_states)

    dir_indices, acc_indices = actions[:, 0], actions[:, 1]
    next_dir_indices, next_acc_indices = np.argmax(q_next_state[0], axis=1), np.argmax(q_next_state[1], axis=1)

    q_state[0][:, dir_indices] = rewards[:, 0] + gamma * q_next_state[0][:, next_dir_indices] * terminals
    q_state[1][:, acc_indices] = rewards[:, 1] + gamma * q_next_state[1][:, next_acc_indices] * terminals

    q_model.fit(states, q_state, epochs=1, batch_size=1, verbose=1)

    total_reward = total_reward + np.mean(reward)
    total_frames = total_frames + 1

    if data['done']:
        ep = ep + 1
        final_reward = np.mean(reward)
        final_rewards.append(final_reward)
        avg_rewards.append(total_reward / total_frames)
        total_frames = 0
        total_reward = 0

        plt.plot(range(ep), final_rewards)
        plt.plot(range(ep), avg_rewards)
        plt.show()

        update_best(final_reward, target_model.get_weights())
        ModelInstanceProvider.update_instance()
        target_model.set_weights(q_model.get_weights())


def update_best(score, weights):
    best_score = pubsub.publisher.get('best_score')
    print("Score: {}, Best score: {}".format(score, float(best_score)))
    if best_score is None or score > float(best_score):
        print("New best is set!")
        pubsub.publisher.set('best_score', str(score))
        best_weights = json.dumps([w.tolist() for w in weights])
        pubsub.publisher.set('best_weights', best_weights)


if __name__ == '__main__':
    ModelInstanceProvider.init(new_model=True)
    q_model = ModelInstanceProvider.get_instance()

    buffer = ReplayBuffer(local=True, buffer_size=5000)

    target_model = Model()
    target_model.compile()
    target_model.set_weights(q_model.get_weights())

    for i in range(num_of_simulations):
        pubsub = RedisPubSub()
        thread = Thread(target=pubsub.subscribe, args=(f'feedback_{i}', handle_feedback,), daemon=False)
        thread.start()
