import os
from redis import Redis
import json


class RedisPubSub(object):

    def __init__(self):
        self.publisher = Redis(host=os.environ.get('REDIS_HOST', 'localhost'), \
            port=os.environ.get('REDIS_PORT', 6379), password=os.environ.get('REDIS_PASSWORD', ''))
        self.subscriber = self.publisher.pubsub()

    def publish(self, channel, message):
        self.publisher.publish(channel, message)

    def subscribe(self, channel, handler, *args):
        self.subscriber.subscribe([channel])
        for message in self.subscriber.listen():
            if message['type'] == 'message':
                handler(json.loads(message['data']), *args)
