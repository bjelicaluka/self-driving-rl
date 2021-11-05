# Self Driving Simulation
- Self Driving Simulation Training using Reinforcement Learning.
- Environment is implemented using JavaScript and can be run in both browser and Node.js.
- Reinforcement Learning algorithm is implemented in Python and trained using tensorflow Keras API. 

## Parameters

### Environment

- Number of simulations in process
- Agent call frequency
- Max speed
- Number of lanes
- Number of cars to create at once
- Are cars spawned randomly or Car sequence and number of wawes for the win

### Actor

- Number of random frames (for epsilon greedy policy)

### Model

- Network architecture
- Optimizer
- Activations fns
- Loss fn

### Gradient Generator

- Gamma - discount factor in MDP (it determines how much do we take into account the future)
- Batch size - number of samples from replay buffer
- Replay buffer size

### Gradient Applier

- Learning rate
- Target model sync frequency - required number of episodes for target and q model synchronization
- Consider adding a const parameter for updating weights - hard/soft update of network params 

## Running the project manually

### Reinforcement Learning

1. `cd rl/`
2. `python -m src.grad_applier`
3. `python -m src.grad_generator <id>`
4. `python -m src.actor <id>`

<p>Repeat steps 3. and 4. in order to start multiple instances.</p>

### Environment Logic

1. `cd environment/logic/`
2. Configure number of simulations and other parameters in `src/config.js`.
3. `npm start`

### Environment Visualization

1. `cd environment/visualization/`
2. Configure parameters in `src/config.js`.
3. `npm start` to run in development environment
4. `npm run build` and serve the static files through HTTP server e.g. `serve -s build/`

## Running in Docker

### Reinforcement Learning

1. `cd rl/`
2. `docker build -t <image_name> .`
3. `docker run -dt <image_name> python -m src.actor <id>`
4. `docker run -dt <image_name> python -m src.grad_generator <id>`
5. `docker run -dt <image_name> python -m src.grad_applier`

<p>Repeat steps 3. and 4. in order to start multiple instances.</p>

### Environment Logic

1. `cd environment/logic/`
2. `docker build -t <image_name> .`
3. `docker run -dtp <port>:<port> -e REDIS_HOST=<redis_host> -e REDIS_PORT=<redis_port> -e PORT=<port> -e LOGGING=false -e NUMBER_OF_SIMULATIONS=<N> <image_name>`

### Environment Visualization

1. `cd environment/visualization/`
2. `docker build -t <image_name> .`
3. `docker run -dtp <port>:80 - API_HOSTNAME=<ws_host> -e API_PROTOCOL=http -e API_PORT=<ws_port> -e API_PATH=/ -e SAME_HOST=true <image_name>`

## Running in docker-compose

1. Edit `.env` file to suit your needs
2. `docker-compose up -d`
