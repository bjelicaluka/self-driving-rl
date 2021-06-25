from threading import Thread
from src.model import ModelInstanceProvider
from src.pubsub import RedisPubSub
import numpy as np
import json

global frame
frame = 0
num_of_simulations = 1
num_dir_actions = 3
num_acc_actions = 3
random_frames = 2500


def epsilon(f):
    return f / (num_of_simulations * random_frames)


def generate_action(data, index):
    global frame
    frame = frame + 1
    state = data['state']

    model = ModelInstanceProvider.get_instance()

    prediction = model.predict(np.array([state[1:7]]))

    print(f"Q values: {prediction}")

    if np.random.rand() > epsilon(frame):
        dir_index = np.array([np.random.randint(0, num_dir_actions)])
        acc_index = np.array([np.random.randint(0, num_acc_actions)])
    else:
        dir_index, acc_index = np.argmax(prediction[0], axis=1), np.argmax(prediction[1], axis=1)

    direction = int(dir_index) - 1
    acceleration = int(acc_index - 1) * 0.05
    print("Action: {} {} Epsilon: {}".format(direction, acceleration, epsilon(frame)))
    pubsub_state.publish(f'action_{index}',
                         json.dumps({'direction': direction, 'acceleration': acceleration, 'state': state}))


def handle_target_model_update(data):
    model = ModelInstanceProvider.get_instance()

    weights = data['weights']
    weights = json.loads(weights)
    weights = [np.array(w) for w in weights]

    model.set_weights(weights)


if __name__ == '__main__':
    ModelInstanceProvider.init(new_model=True)

    for i in range(num_of_simulations):
        pubsub_state = RedisPubSub()
        action_thread = Thread(target=pubsub_state.subscribe, args=(f'state_{i}', generate_action, i,), daemon=False)
        action_thread.start()

    pubsub_model = RedisPubSub()
    target_model_update_thread = Thread(target=pubsub_model.subscribe,
                                        args=('model_update', handle_target_model_update,),
                                        daemon=False)
    target_model_update_thread.start()
