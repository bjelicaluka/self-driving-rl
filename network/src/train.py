from threading import Thread
import numpy as np

from src.pubsub import RedisPubSub
from src.replay_buffer import ReplayBuffer
from src.model import ModelInstanceProvider, Model

num_of_simulations = 1


def handle_feedback(data):
    state = data['state']
    action = data['action']
    reward = data['reward']
    next_state = data['next_state']
    terminal = 0 if data['done'] else 1

    buffer.add(state[1:7], action, reward, next_state[1:7], terminal)

    gamma = 0.99
    batch_size = 32

    states, actions, rewards, next_states, terminals = buffer.get_batch(batch_size)

    actions = actions.reshape(len(actions), 2)

    q_state = q_model.predict(states)
    q_next_state = target_model.predict(next_states)

    direction_indices = np.array(actions[:, 0]).astype(int)
    next_direction_indices = np.argmax(q_next_state, axis=1)

    q_state[:, direction_indices] = rewards[:, 0] + gamma * q_next_state[:, next_direction_indices] * terminals

    q_model.fit(states, q_state, epochs=1, batch_size=1, verbose=1)

    if data['done']:
        target_model.set_weights(q_model.get_weights())
        ModelInstanceProvider.update_instance()


if __name__ == '__main__':
    ModelInstanceProvider.init(new_model=True)
    q_model = ModelInstanceProvider.get_instance()

    buffer = ReplayBuffer(local=True, buffer_size=2000)

    target_model = Model()
    target_model.compile()
    target_model.set_weights(q_model.get_weights())

    for i in range(num_of_simulations):
        pubsub = RedisPubSub()
        thread = Thread(target=pubsub.subscribe, args=(f'feedback_{i}', handle_feedback,), daemon=False)
        thread.start()
