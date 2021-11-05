from threading import Thread, Lock
import matplotlib.pyplot as plt

from src.components.global_model import GlobalModelInstance
from src.components.pubsub import RedisPubSub
from src.utils.gradients import string_to_gradients

episodes_finished = 0
final_rewards = []
target_model_sync_frequency = 10


def handle_gradients(data):
    gradients = string_to_gradients(data['gradients'])

    lock.acquire()
    global_q_model.get_model().apply_gradients(gradients, discount_factor=0.01)
    global_q_model.commit()
    lock.release()


def handle_episode_end(data):
    score = float(data['score'])
    weights = data['weights']

    global episodes_finished
    episodes_finished = episodes_finished + 1

    final_rewards.append(score)

    plt.plot(range(episodes_finished), final_rewards)
    plt.savefig('plt.png')
    plt.close()

    update_best_model(score, weights)

    if episodes_finished % target_model_sync_frequency == 0:
        sync_target_and_q_models()
        global_target_model.commit()


def update_best_model(score, weights):
    best_score = episode_end_pubsub.publisher.get('best_score')
    print("Score: {}, Best score: {}".format(score, float(best_score) if best_score is not None else 0))
    if best_score is None or score > float(best_score):
        print("New best is set!")
        episode_end_pubsub.publisher.set('best_score', str(score))
        episode_end_pubsub.publisher.set('best_weights', weights)


def sync_target_and_q_models():
    # TODO: razmisliti da li pomnoziti q tezine sa nekim koeficijentom
    global_target_model.get_model().set_weights(global_q_model.get_model().get_weights())


if __name__ == '__main__':
    lock = Lock()

    new_model = True

    global_q_model = GlobalModelInstance('q')
    global_target_model = GlobalModelInstance('target')

    global_q_model.init(new_model=new_model)
    global_target_model.init(new_model=new_model)

    if new_model:
        sync_target_and_q_models()

    grad_pubsub = RedisPubSub()
    episode_end_pubsub = RedisPubSub()

    grad_thread = Thread(target=grad_pubsub.subscribe, args=(f'gradients', handle_gradients,), daemon=False)
    episode_end_thread = Thread(target=episode_end_pubsub.subscribe, args=(f'episode_end', handle_episode_end,),
                                daemon=False)

    grad_thread.start()
    episode_end_thread.start()
