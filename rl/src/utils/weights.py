import json
import numpy as np


def weights_to_string(weights):
    return json.dumps([w.tolist() for w in weights])


def string_to_weights(weights_string):
    weights = json.loads(weights_string)
    return [np.array(w) for w in weights]
