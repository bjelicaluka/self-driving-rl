from tensorflow.keras import Model as KerasModel
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.losses import MeanSquaredError
from tensorflow.keras.optimizers import Adam


class Model(object):

    def __init__(self) -> None:
        super().__init__()
        self._optimizer = Adam(learning_rate=0.0001)
        self._loss_fn = MeanSquaredError()

        state_input = Input(shape=(6,))

        hidden_for_dir = Dense(32, activation='relu')(state_input)
        hidden_for_acc = Dense(32, activation='relu')(state_input)
        dir_output = Dense(3, activation='linear')(hidden_for_dir)
        acc_output = Dense(3, activation='linear')(hidden_for_acc)

        self._model = KerasModel(inputs=state_input, outputs=[dir_output, acc_output])

    def compile(self):
        self._model.compile(loss=self._loss_fn,
                            optimizer=self._optimizer,
                            metrics=['accuracy'])

    def fit(self, x, y, epochs=1, batch_size=1, verbose=1):
        self._model.fit(x, y, epochs=epochs, batch_size=batch_size, verbose=verbose)

    def predict(self, x):
        return self._model.predict(x)

    def evaluate(self, x, y):
        return self._model.evaluate(x, y)

    def apply_gradients(self, gradients, discount_factor=0.2):
        self._optimizer.apply_gradients(zip(gradients * discount_factor, self._model.trainable_weights))

    def get_loss_fn(self):
        return self._loss_fn

    def get_trainable_weights(self):
        return self._model.trainable_weights

    def get_weights(self):
        return self._model.get_weights()

    def set_weights(self, weights):
        self._model.set_weights(weights)

    def save(self, path):
        self._model.save(path)

    def load(self, path):
        self._model = load_model(path)

    def __call__(self, *args, **kwargs):
        return self._model(*args, **kwargs)
