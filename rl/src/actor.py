import sys
import json
import numpy as np
from collections import defaultdict
from threading import Thread

from src.components.global_model import GlobalModelInstance
from src.components.pubsub import RedisPubSub

num_of_simulations = 2
num_dir_actions = 3
num_acc_actions = 3
random_frames = 5000
frames_count = defaultdict(lambda: 0)


def epsilon(f):
    return f / random_frames


def act(data, pubsub_, index):
    frames = frames_count[index]
    frames_count[index] = frames + 1

    state = data['state']

    model = global_model.get_model()

    prediction = model.predict(np.array([state[1:7]]))

    print(f"Q values: {prediction}")

    if np.random.rand() > epsilon(frames):
        dir_index = np.array([np.random.randint(0, num_dir_actions)])
        acc_index = np.array([np.random.randint(0, num_acc_actions)])
    else:
        dir_index, acc_index = np.argmax(prediction[0], axis=1), np.argmax(prediction[1], axis=1)

    direction = int(dir_index) - 1
    acceleration = int(acc_index - 1) * 0.05

    print("Action: {} {} Epsilon: {}".format(direction, acceleration, epsilon(frames)))

    pubsub_.publish(f'action_{index}',
                    json.dumps({'direction': direction, 'acceleration': acceleration, 'state': state}))


if __name__ == '__main__':
    simulation_id = sys.argv[1]
    print(simulation_id)
    global_model = GlobalModelInstance('target')
    global_model.init()

    pubsub = RedisPubSub()
    action_thread = Thread(target=pubsub.subscribe, 
        args=(f'state_{simulation_id}', act, pubsub, int(simulation_id),), daemon=False)
    action_thread.start()

    global_model.subscribe_for_model_updates()
