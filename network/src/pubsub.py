from redis import Redis
import json

class RedisPubSub(object):

  def __init__(self):
    self.publisher = Redis(host='localhost', port=6379, password='1234')
    self.subscriber = self.publisher.pubsub()


  def publish(self, channel, message):
    self.publisher.publish(channel, message)
  
  def subscribe(self, channel, handler):
    self.subscriber.subscribe([channel])
    for message in self.subscriber.listen():
      if(message['type'] == 'message'):
        handler(json.loads(message['data']))


