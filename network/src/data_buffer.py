from src.settings import update_model
from threading import Thread
from src.train_script import train
from uuid import uuid4

def retrain_network(file_name):
    update_model(train(file_name))

class DataHandler(object):
    def __init__(self):
        super().__init__()
        self._data_num = 1
        self._training_sample_batch_id = str(uuid4())
        self._training_sample_batch_size = 50
        self._previous_data_string = ""

    def update_data(self, state):
        self._previous_data_string = ",".join([f"{x[0]}" for x in state])

    def save_previous_data(self, previous_reward):
        if self._previous_data_string == "": return

        data_string = self._previous_data_string + "," + str(previous_reward) + '\n'

        file_name = f"data/data{self._training_sample_batch_id}.csv"
        with open(file_name, "a") as ds_file:
            ds_file.write(data_string)
        
        self._data_num = self._data_num + 1
        if self._data_num == self._training_sample_batch_size:
            self._data_num = 0
            self._training_sample_batch_id = str(uuid4())
            thread = Thread(target=retrain_network, args=(file_name, ), daemon=True)
            thread.start()