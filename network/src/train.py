import numpy as np

from src.data_buffer import DataBuffer
from src.model import ModelInstanceProvider


def train():
    train_model = ModelInstanceProvider.get_instance()

    gamma = 0.8
    batch_size = 32

    states, actions, rewards, next_states = buffer.get_batch(batch_size)

    actions = actions.reshape(len(actions), 2)

    q_state = train_model.predict(states)
    q_next_state = train_model.predict(next_states)

    direction_indices, acceleration_indices = actions[:, 0], actions[:, 1]
    next_direction_indices, next_acceleration_indices = \
        np.argmax(q_next_state[0], axis=1), np.argmax(q_next_state[1], axis=1)

    q_state[0][:, direction_indices] = (rewards[:, 0] +
                                        gamma * q_next_state[0][:, next_direction_indices])
    q_state[1][:, acceleration_indices] = (rewards[:, 1] +
                                           gamma * q_next_state[1][:, next_acceleration_indices])

    train_model.fit(states, q_state, epochs=1, batch_size=16, verbose=1)


if __name__ == '__main__':
    ModelInstanceProvider.init()

    buffer = DataBuffer(local=False)

    # states, actions, rewards, next_states = buffer.get_batch(10)
    # print(states)
    # print(actions)
    # print(rewards)
    # print(next_states)
    # actions = actions.reshape(len(actions), 2)
    train()
