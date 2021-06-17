from threading import Thread
from src.data_buffer import DataBuffer
from src.model import ModelInstanceProvider
from src.pubsub import RedisPubSub
import numpy as np
import json


num_of_simulations = 4

num_dir_actions = 3
num_acc_actions = 2


def generate_action(data):
    model = ModelInstanceProvider.get_instance()

    state = data['state']
    episode_id = data['episode_id']

    prediction = model.predict(np.array([state]))

    if np.random.rand() > 0.5:
        direction_index = np.array([np.random.randint(0, num_dir_actions)])
        acceleration_index = np.array([np.random.randint(0, num_acc_actions)])
    else:
        direction_index, acceleration_index = np.argmax(prediction[0], axis=1), np.argmax(prediction[1], axis=1)

    direction = int(direction_index) - 1
    acceleration = float((acceleration_index - 0.5) / 10)

    pubsub_state.publish(f'action_{episode_id}', json.dumps({'direction': direction, 'acceleration': acceleration, 'state': state}))


def handle_feedback(data):
    state = data['state']
    action = data['action']
    reward = data['reward']
    next_state = data['next_state']

    buffer.add(state, action, reward, next_state)


def handle_target_model_update(data):
    weights = data['weights']
    weights = json.loads(weights)
    weights = [np.array(w) for w in weights]

    ModelInstanceProvider.get_instance().set_weights(weights)


if __name__ == '__main__':
    ModelInstanceProvider.init()

    buffer = DataBuffer(local=False)

    for i in range(num_of_simulations):
        pubsub_state = RedisPubSub()
        pubsub_feedback = RedisPubSub()
        action_thread = Thread(target=pubsub_state.subscribe, args=(f'state_{i}', generate_action,), daemon=False)
        feedback_thread = Thread(target=pubsub_feedback.subscribe, args=(f'feedback_{i}', handle_feedback,),
                                 daemon=False)
        action_thread.start()
        feedback_thread.start()

    pubsub_model = RedisPubSub()
    target_model_update_thread = Thread(target=pubsub_model.subscribe,
                                        args=('target_model_update', handle_target_model_update,),
                                        daemon=False)
    target_model_update_thread.start()
