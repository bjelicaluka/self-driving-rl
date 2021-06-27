from src.components.global_model import GlobalModelInstance

global_model = GlobalModelInstance('best')
global_model.init()
global_model.get_model().save('saved-model')
