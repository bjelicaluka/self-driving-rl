import numpy as np

from src.replay_buffer import ReplayBuffer
from src.model import ModelInstanceProvider

dir_actions = [0, 0.5, 1]
acc_actions = [0, 0.5, 1]


def train():
    q_model = ModelInstanceProvider.get_instance()

    gamma = 0.99
    batch_size = len(buffer)

    states, actions, rewards, next_states, terminals = buffer.get_batch(batch_size)

    actions = actions.reshape(len(actions), 2)

    q_state = q_model.predict(states)
    q_next_state = target_model.predict(next_states)

    direction_indices, acceleration_indices = actions[:, 0], actions[:, 1]
    next_direction_indices, next_acceleration_indices = \
        np.argmax(q_next_state[0], axis=1), np.argmax(q_next_state[1], axis=1)

    q_state[0][:, direction_indices] = \
        rewards[:, 0] + gamma * q_next_state[0][:, next_direction_indices] * terminals
    q_state[1][:, acceleration_indices] = \
        rewards[:, 1] + gamma * q_next_state[1][:, next_acceleration_indices] * terminals

    q_model.fit(states, q_state, epochs=10, batch_size=32, verbose=1)


if __name__ == '__main__':
    ModelInstanceProvider.init(new_model=False)

    buffer = ReplayBuffer(local=False)

    for e in range(1000):
        buffer.load()
        print(f"Buffer length: {len(buffer)}")

        target_model = ModelInstanceProvider.get_instance()

        for _ in range(10):
            print(f"Epoch: {e} - Trained: {_}")
            train()
        ModelInstanceProvider.save_instance()
