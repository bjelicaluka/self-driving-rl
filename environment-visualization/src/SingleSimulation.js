import React from "react";
import { ResultDisplay } from "./components/ResultDisplay";
import { Environment } from "./Environment";
import { TrafficEventHandler } from "./event-handler/TrafficEventHandler";
import { Agent } from "./model/Agent";
import { FrontSensor } from "./sensors/FrontSensor";
import { LeftSideSensor } from "./sensors/LeftSideSensor";
import { RightSideSensor } from "./sensors/RightSideSensor";
import { CollisionSensor } from "./sensors/CollisionSensor";
import { setConfig } from "./config";

export default class SingleSimulation extends React.Component {
    constructor(props) {
        super(props);
        this.trafficEventHandler = new TrafficEventHandler(this.props.simulationNamespaceId);
        this.state = {
            speed: 0,
            avgSpeed: 0,
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
            this.updateSpeed(traffic.speed);
            this.updateAvgSpeed(traffic.avgSpeed);
            this.updatePassedCars(traffic.passedCars);
            this.cars = traffic.cars.map(car => {
                if (car.isAgent) {
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

    updateSpeed = (speed) => {
        this.setState({ speed })
    }

    updateAvgSpeed = (avgSpeed) => {
        this.setState({ avgSpeed })
    }

    updatePassedCars = (passedCars) => {
        this.setState({ passedCars });
    }

    render() {
        return (
            <div className='row'>
                <div className="col-sm-12 col-md-3 col-lg-3">
                    <div className="col-12">
                        <ResultDisplay
                            speed={this.state.speed}
                            avgSpeed={this.state.avgSpeed}
                            passedCars={this.state.passedCars}
                            layers={this.state.layers}
                            showSensors={this.state.showSensors}
                            toggleShowSensors={this.toggleShowSensors}
                            trafficEventHandler={this.trafficEventHandler}
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
        );
    }
}