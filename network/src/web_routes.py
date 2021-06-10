from src.data_handler import DataHandler
from flask import Flask, request, jsonify, make_response
import numpy as np
from flask_cors import CORS
import src.settings as settings


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, resources={r"/*": {"origins": "*"}})

settings.init()

data_handler = DataHandler() 

@app.route('/predict', methods=['POST'])
def predict():
    print(settings.model.id)
    data = request.get_json()
    
    previous_reward = data['previous_reward']
    # data_handler.save_previous_data(previous_reward)

    actions = [-0.5, 0, 0.5]
    accelerations = [-0.5, 0.5]
    state = data['state']
    states_with_acc = np.array([np.array([acc] + [float(s) for s in state]) for acc in accelerations])
    states_with_acc_and_action = np.array([[[action]] + [[a] for a in s] for s in states_with_acc for action in actions])

    prediction = settings.model.predict(states_with_acc_and_action)

    predicted_action_index = np.argmax(prediction)
    action = states_with_acc_and_action[predicted_action_index][0]
    acceleration = states_with_acc_and_action[predicted_action_index][1]

    # data_handler.update_data(states_with_acc_and_action[predicted_action_index])

    response_data = {'action': int(action*2), 'acceleration': float(acceleration)}
    return make_response(jsonify(response_data), 200)


@app.route('/heartbeat', methods=['GET'])
def heartbeat():
    return make_response({"message": "success"}, 200)


if __name__ == "__main__":
    app.run(port=4000)