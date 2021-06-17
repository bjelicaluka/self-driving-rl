from tensorflow.keras import Model as KerasModel
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.losses import MeanSquaredError
from tensorflow.keras.optimizers import Adam
import json
import numpy as np

from src.pubsub import RedisPubSub


class Model(object):

    def __init__(self, network_id='0') -> None:
        super().__init__()
        self.network_id = network_id
        self.learning_rate = 0.00025

        state_input = Input(shape=(7,))

        hidden_for_dir = Dense(16, activation='relu')(state_input)
        hidden_for_acc = Dense(16, activation='relu')(state_input)

        direction_output = Dense(3, activation='linear')(hidden_for_dir)
        acceleration_output = Dense(2, activation='linear')(hidden_for_acc)

        self._model = KerasModel(inputs=state_input, outputs=[direction_output, acceleration_output])

    def compile(self):
        self._model.compile(loss=MeanSquaredError(),
                            optimizer=Adam(learning_rate=self.learning_rate, clipnorm=1.0),
                            metrics=['accuracy'])

    def fit(self, x, y, epochs=100, batch_size=1, verbose=1):
        self._model.fit(x, y, epochs=epochs, batch_size=batch_size, verbose=verbose)

    def predict(self, x):
        return self._model.predict(x)

    def evaluate(self, x, y):
        return self._model.evaluate(x, y)

    def get_weights(self):
        return self._model.get_weights()

    def set_weights(self, weights):
        self._model.set_weights(weights)

    def save(self, path):
        self._model.save(path)

    def load(self, path):
        self._model = load_model(path)


class ModelInstanceProvider(object):

    @staticmethod
    def init():
        global model
        model = Model()
        model.compile()
        pubsub = RedisPubSub()
        weights = pubsub.publisher.get('weights')
        if weights is not None:
            weights = json.loads(weights)
            weights = [np.array(w) for w in weights]
            model.set_weights(weights)

    @staticmethod
    def get_instance():
        global model
        return model
