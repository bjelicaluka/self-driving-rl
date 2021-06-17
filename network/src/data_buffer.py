from collections import deque
import numpy as np
import json
from src.pubsub import RedisPubSub


class DataBuffer(object):
    def __init__(self, local=True):
        super().__init__()
        self._sample = None
        self._buffer_size = 5000
        self._local = local
        self._pubsub = RedisPubSub() if not self._local else None

        self._states = deque(maxlen=self._buffer_size)
        self._actions = deque(maxlen=self._buffer_size)
        self._rewards = deque(maxlen=self._buffer_size)
        self._next_states = deque(maxlen=self._buffer_size)

    def add(self, state, action, reward, next_state):
        self._sample = {'state': state, 'action': action, 'reward': reward, 'next_state': next_state}
        self._add_to_local_buffer() if self._local else self._add_to_remote_buffer()

    def get_batch(self, batch_size):
        if not self._local:
            self._fetch_from_remote_buffer()
        size = min(batch_size, len(self._states))
        batch = np.random.choice(size, size)
        return np.array(self._states)[batch], np.array(self._actions)[batch], \
            np.array(self._rewards)[batch], np.array(self._next_states)[batch]

    def _fetch_from_remote_buffer(self):
        self._states = [json.loads(s) for s in self._pubsub.publisher.lrange('states', 0, -1)]
        self._actions = [json.loads(s) for s in self._pubsub.publisher.lrange('actions', 0, -1)]
        self._rewards = [json.loads(s) for s in self._pubsub.publisher.lrange('rewards', 0, -1)]
        self._next_states = [json.loads(s) for s in self._pubsub.publisher.lrange('next_states', 0, -1)]

    def _add_to_local_buffer(self):
        self._states.append(self._sample['state'])
        self._actions.append(self._sample['action'])
        self._rewards.append(self._sample['reward'])
        self._next_states.append(self._sample['next_state'])

    def _add_to_remote_buffer(self):
        self._send_list_to_remote_buffer('states', self._sample['state'])
        self._send_list_to_remote_buffer('actions', self._sample['action'])
        self._send_list_to_remote_buffer('rewards', self._sample['reward'])
        self._send_list_to_remote_buffer('next_states', self._sample['next_state'])

    def _send_list_to_remote_buffer(self, key, list_):
        self._pubsub.publisher.rpush(key, json.dumps(list_))
