from tensorflow.keras import Model as KerasModel
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.losses import MeanSquaredError
from tensorflow.keras.optimizers import Adam
import json
import numpy as np

from src.pubsub import RedisPubSub


class Model(object):

    def __init__(self) -> None:
        super().__init__()
        state_input = Input(shape=(6,))

        hidden_for_dir = Dense(32, activation='relu')(state_input)
        # hidden_for_dir = Dense(32, activation='relu')(hidden_for_dir)
        direction_output = Dense(3, activation='linear')(hidden_for_dir)

        self._model = KerasModel(inputs=state_input, outputs=direction_output)

    def compile(self):
        self._model.compile(loss=MeanSquaredError(),
                            optimizer=Adam(learning_rate=0.001),
                            metrics=['accuracy'])

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
    def init(new_model=False, file_path=None):
        global model, pubsub
        model = Model()
        model.compile()
        pubsub = RedisPubSub()
        if new_model:
            pubsub.publisher.delete('weights')
        elif file_path is not None:
            model.load(file_path)
        else:
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
    def update_instance():
        global model, pubsub
        weights = json.dumps([w.tolist() for w in model.get_weights()])
        pubsub.publisher.set('weights', weights)
        pubsub.publish('model_update', json.dumps({'weights': weights}))
