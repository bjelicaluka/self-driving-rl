from redis import Redis

r = Redis(host='localhost', port=6379, password='1234')

r.delete('states')
r.delete('actions')
r.delete('rewards')
r.delete('next_states')
r.delete('terminals')
