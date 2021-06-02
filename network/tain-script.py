from model import Model
import pandas
import numpy as np
from tensorflow.keras.utils import to_categorical
from sklearn.preprocessing import LabelEncoder

dataframe = pandas.read_csv("ds.csv", header=None)
dataset = dataframe.values
X = dataset[:,0:6].astype(float)
Y = dataset[:,6]

encoder = LabelEncoder()
encoder.fit(Y)
encoded_Y = encoder.transform(Y)

dummy_y = to_categorical(encoded_Y)

model = Model()
# model.compile()

model.load('test.model')
model.fit(X, dummy_y, epochs=100)

_, accuracy = model.evaluate(X, dummy_y)

print('Accuracy: %.2f' % (accuracy*100))

print(model.predict(np.array(X[0]).reshape(1, 6)))

model.save("test.model")
