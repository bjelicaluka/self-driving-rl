from redis import Redis

r = Redis(host='localhost', port=6379, password='1234')

r.delete('best_score')
r.delete('best_weights')
