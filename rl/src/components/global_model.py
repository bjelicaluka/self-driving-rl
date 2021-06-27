import json
from threading import Thread

from src.components.model import Model
from src.components.pubsub import RedisPubSub
from src.utils.weights import string_to_weights, weights_to_string


class GlobalModelInstance(object):

    def __init__(self, name):
        self._name = name
        self._model = Model()
        self._pubsub = RedisPubSub()

    def init(self, new_model=False):
        if new_model:
            self._pubsub.publisher.delete(f'{self._name}_weights')
            self.commit()
        else:
            self.sync()
        self._model.compile()

    def get_model(self):
        return self._model

    def sync(self, *args):
        weights = self._pubsub.publisher.get(f'{self._name}_weights')
        if weights is not None:
            self._model.set_weights(string_to_weights(weights))

    def commit(self):
        weights = weights_to_string(self._model.get_weights())
        self._pubsub.publisher.set(f'{self._name}_weights', weights)
        self._pubsub.publish(f'{self._name}_model_update', json.dumps({'weights': weights}))

    def subscribe_for_model_updates(self):
        target_model_update_thread = Thread(target=self._pubsub.subscribe,
                                            args=(f'{self._name}_model_update', self.sync,),
                                            daemon=False)
        target_model_update_thread.start()
