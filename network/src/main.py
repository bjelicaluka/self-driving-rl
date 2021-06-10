from model import ModelInstanceProvider
from pubsub import RedisPubSub
import numpy as np
import json


def handle_data(data):
  model = ModelInstanceProvider.get_instance()

  actions = [-0.5, 0, 0.5]
  accelerations = [-0.5, 0.5]
  state = data['state']
  states_with_acc = np.array([np.array([acc] + [float(s) for s in state]) for acc in accelerations])
  states_with_acc_and_action = np.array([[[action]] + [[a] for a in s] for s in states_with_acc for action in actions])

  prediction = model.predict(states_with_acc_and_action)

  predicted_action_index = np.argmax(prediction)
  action = states_with_acc_and_action[predicted_action_index][0]
  acceleration = states_with_acc_and_action[predicted_action_index][1]
  
  pubsub.publish('action_0', json.dumps({'action': int(action*2), 'acceleration': float(acceleration)}))


if __name__ == '__main__':
  ModelInstanceProvider.init("trained-model", new_model=False)

  pubsub = RedisPubSub()
  pubsub.subscribe('state_0', handle_data)