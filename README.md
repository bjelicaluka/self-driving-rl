# Self Driving Simulation
- Self Driving Simulation Training using Reinforcement Learning.
- Environment is implemented using JavaScript and can be run in both browser and Node.js.
- Reinforcement Learning algorithm is implemented in Python and trained using tensorflow Keras API. 

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