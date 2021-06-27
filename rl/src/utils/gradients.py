import json
import numpy as np


def gradients_to_string(gradients):
    return json.dumps([g.numpy().tolist() for g in gradients])


def string_to_gradients(gradients_string):
    gradients = json.loads(gradients_string)
    return np.array([np.array(g) for g in gradients])
