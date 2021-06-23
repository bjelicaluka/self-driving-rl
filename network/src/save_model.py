from src.model import ModelInstanceProvider


ModelInstanceProvider.init(new_model=False)
model = ModelInstanceProvider.get_instance()
model.save('saved-model')
