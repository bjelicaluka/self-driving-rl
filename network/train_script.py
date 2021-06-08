from tensorflow.python.ops.gen_math_ops import Mod
from model import Model
import pandas
from os import remove

def train(file_name) -> Model:
  dataframe = pandas.read_csv(file_name, header=None)
  dataset = dataframe.values
  X = dataset[:,0:8]
  Y = dataset[:,8]

  model = Model()
  model.load("trained-model")

  model.fit(X, Y, epochs=50, batch_size=5)

  model.save("trained-model")
  model.id = file_name
  remove(file_name)
  return model

if __name__ == '__main__':
  model = Model()
  model.compile()
  model.save('trained-model')