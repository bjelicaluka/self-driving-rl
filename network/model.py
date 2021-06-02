from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense

class Model(object):

  def __init__(self) -> None:
      super().__init__()
      self._model = Sequential()
      self._model.add(Dense(6, input_dim=6, activation='relu'))
      self._model.add(Dense(4, activation='relu'))
      self._model.add(Dense(3, activation='softmax'))

  def compile(self):
    self._model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
  
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