import React from "react";
import ReactDOM from "react-dom";
import { ResultDisplay } from "./components/ResultDisplay";
import { Environment } from "./Environment";
import { TrafficEventHandler } from "./event-handler/TrafficEventHandler";
import { Agent } from "./model/Agent";
import { FrontSensor } from "./sensors/FrontSensor";
import { LeftSideSensor } from "./sensors/LeftSideSensor";
import { RightSideSensor } from "./sensors/RightSideSensor";
import { CollisionSensor } from "./sensors/CollisionSensor";
import { setConfig } from "./config";

export default class MainWindow extends React.Component {
    constructor(props) {
        super(props);
        const episodeNamespaceId = window.location.pathname;
        this.trafficEventHandler = new TrafficEventHandler(episodeNamespaceId);
        this.state = {
            speed: 1,
            passedCars: 0,
            showSensors: true,
            layers: []
        }
        this.cars = [];
    }

    componentDidMount() {
        this.trafficEventHandler.onConfig(config => {
            setConfig(config);
        });

        this.trafficEventHandler.onTraffic(traffic => {
            this.updatePassedCars(traffic.passedCars);
            this.changeSpeed(traffic.speed);
            this.cars = traffic.cars.map(car => {
                if(car.isAgent) {
                    Object.setPrototypeOf(car, Agent.prototype);
                    Object.setPrototypeOf(car.frontSensor, FrontSensor.prototype);
                    Object.setPrototypeOf(car.leftSideSensor, LeftSideSensor.prototype);
                    Object.setPrototypeOf(car.rightSideSensor, RightSideSensor.prototype);
                    Object.setPrototypeOf(car.collisionSensor, CollisionSensor.prototype);
                }
                return car;
            });
        });
    }

    toggleShowSensors = () => {
        this.setState({ showSensors: !this.state.showSensors });
    }

    changeSpeed = (speed) => {
        this.setState({ speed: speed })
    }

    updatePassedCars = (passedCars) => {
        this.setState({ passedCars: passedCars });
    }

    render() {
        return (
            <div>
                <div className='row'>
                    <div className="col-sm-12 col-md-3 col-lg-3">
                        <div className="col-12">
                            <ResultDisplay
                                agentSpeed={this.state.speed}
                                passedCars={this.state.passedCars}
                                layers={this.state.layers}
                                showSensors={this.state.showSensors}
                                toggleShowSensors={this.toggleShowSensors}
                            />
                        </div>
                    </div>
                    <div className="mt-5 col-sm-12 col-md-6 col-lg-6">
                        <div className="col-12">
                            <Environment
                                showSensors={this.state.showSensors}
                                handleMousePressed={this.handleMousePressed}
                                keyPressed={this.handleKeyPressed}
                                cars={this.cars}
                                speed={this.state.speed}
                            />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

ReactDOM.render(<MainWindow />, document.getElementById("root"));