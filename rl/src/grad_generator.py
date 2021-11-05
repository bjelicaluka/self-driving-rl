import sys
import json
import numpy as np
import tensorflow as tf

from threading import Thread

from src.components.global_model import GlobalModelInstance
from src.components.pubsub import RedisPubSub
from src.components.replay_buffer import ReplayBuffer
from src.utils.gradients import gradients_to_string
from src.utils.weights import weights_to_string

# Params
gamma = 0.99
batch_size = 1024
replay_buffer_size = 10000

# Plot utils
total_reward = 0
total_frames = 0


def handle_feedback(data):
    state = data['state']
    action = data['action']
    reward = data['reward']
    next_state = data['next_state']
    terminal = 0 if data['done'] else 1

    buffer.add(state[1:7], action, reward, next_state[1:7], terminal)

    generate_gradients()

    global total_reward, total_frames
    total_reward = total_reward + np.mean(reward)
    total_frames = total_frames + 1

    if data['done']:
        emit_episode_end(np.mean(reward))


def generate_gradients():
    global_q_model.sync()
    q_model = global_q_model.get_model()
    target_model = global_target_model.get_model()
    states, actions, rewards, next_states, terminals = buffer.get_batch(batch_size)
    actions = actions.reshape(len(actions), 2)

    q_states = q_model.predict(states)
    q_next_states = target_model.predict(next_states)

    dir_indices, acc_indices = actions[:, 0], actions[:, 1]
    next_dir_indices, next_acc_indices = np.argmax(q_next_states[0], axis=1), np.argmax(q_next_states[1], axis=1)
    q_states[0][:, dir_indices] = rewards[:, 0] + gamma * q_next_states[0][:, next_dir_indices] * terminals
    q_states[1][:, acc_indices] = rewards[:, 1] + gamma * q_next_states[1][:, next_acc_indices] * terminals

    # calc grads
    with tf.GradientTape() as tape:
        # Loss value for this batch.
        loss_value = global_q_model.get_model().get_loss_fn()(q_states, q_model(states))

    # Get gradients of loss wrt the weights.
    gradients = tape.gradient(loss_value, q_model.get_trainable_weights())
    # send grads
    pubsub.publish('gradients', json.dumps({'gradients': gradients_to_string(gradients)}))


def emit_episode_end(score):
    weights = weights_to_string(global_target_model.get_model().get_weights())
    pubsub.publish('episode_end', json.dumps({'score': float(score), 'weights': weights}))


def subscribe_for_feedback():
    thread = Thread(target=pubsub.subscribe, args=(f'feedback_{simulation_id}', handle_feedback,), daemon=False)
    thread.start()


if __name__ == '__main__':
    simulation_id = sys.argv[1]

    global_q_model = GlobalModelInstance('q')
    global_target_model = GlobalModelInstance('target')

    global_q_model.init()
    global_target_model.init()

    buffer = ReplayBuffer(local=True, buffer_size=replay_buffer_size)
    pubsub = RedisPubSub()

    subscribe_for_feedback()
    global_target_model.subscribe_for_model_updates()
