from tensorflow.keras import Model as KerasModel
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Dense, Input

class Model(object):

  def __init__(self, id=0) -> None:
      super().__init__()
      self.id = id
      inp= Input(shape=(8, ))

      x = Dense(32, activation='relu')(inp)
      x = Dense(16, activation='relu')(x)
      x = Dense(8, activation='relu')(x)

      out1 = Dense(1, activation='sigmoid')(x)

      self._model = KerasModel(inputs=inp, outputs=out1)

  def compile(self):
    self._model.compile(loss=['mean_squared_error', 'mean_squared_error'], optimizer='adam')
  
  def fit(self, x, y, epochs=100, batch_size=1):
    self._model.fit(x, y, epochs=epochs, batch_size=batch_size)

  def predict(self, x):
    return self._model.predict(x)

  def evaluate(self, x, y):
    return self._model.evaluate(x, y)

  def save(self, path):
    self._model.save(path)

  def load(self, path):
    self._model = load_model(path)