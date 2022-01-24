import json
from flask import Flask, request
from src.components.pubsub import RedisPubSub

app = Flask(__name__)


@app.get("/params")
def hello():
    print(request.args.to_dict())
    params_pubsub.publish('params', json.dumps(request.args.to_dict()))
    return f"Hello!"


if __name__ == '__main__':
    params_pubsub = RedisPubSub()
    app.run(host='0.0.0.0', port = 5000)