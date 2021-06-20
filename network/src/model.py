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
        self.learning_rate = 0.001

        state_input = Input(shape=(7,))

        hidden_for_dir = Dense(50, activation='relu')(state_input)
        hidden_for_acc = Dense(50, activation='relu')(state_input)

        hidden_for_dir_ = Dense(50, activation='relu')(hidden_for_dir)
        hidden_for_acc_ = Dense(50, activation='relu')(hidden_for_acc)

        direction_output = Dense(3, activation='linear')(hidden_for_dir_)
        acceleration_output = Dense(2, activation='linear')(hidden_for_acc_)

        self._model = KerasModel(inputs=state_input, outputs=[direction_output, acceleration_output])

    def compile(self):
        self._model.compile(loss=MeanSquaredError(),
                            optimizer=Adam(learning_rate=self.learning_rate),
                            metrics=['mse'])

    def fit(self, x, y, epochs=1, batch_size=1, verbose=1):
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
    def init(new_model=False):
        global model, pubsub
        model = Model()
        model.compile()
        pubsub = RedisPubSub()
        if new_model:
            pubsub.publisher.delete('weights')
        weights = pubsub.publisher.get('weights')
        if weights is not None:
            weights = json.loads(weights)
            weights = [np.array(w) for w in weights]
            model.set_weights(weights)

    @staticmethod
    def get_instance():
        global model
        return model

    @staticmethod
    def save_instance():
        global model, pubsub
        weights = json.dumps([w.tolist() for w in model.get_weights()])
        pubsub.publisher.set('weights', weights)
        pubsub.publish('target_model_update', json.dumps({'weights': weights}))
