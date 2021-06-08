from model import Model


compile = False


def init():
  global model
  model = Model()
  if not compile:
    model.load("trained-model")
  else:
    model.compile()
    model.save("trained-model")


def update_model(new_model):
  global model
  model = new_model
