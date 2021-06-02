from model import Model
from flask import Flask, request, jsonify, make_response
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, resources={r"/*": {"origins": "*"}})

model = Model()
model.load("trained-model")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_array = np.array(data['input_array']).reshape(1, 6)
    prediction = model.predict(input_array)
    response_data = {'prediction': prediction.tolist(), 'code': 'SUCCESS'}
    return make_response(jsonify(response_data), 200)


@app.route('/heartbeat', methods=['GET'])
def heartbeat():
    return make_response({"message": "success"}, 200)


if __name__ == "__main__":
    app.run(port=3000)