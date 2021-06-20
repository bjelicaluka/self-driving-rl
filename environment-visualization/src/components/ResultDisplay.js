import React from "react";
import { AgentInputForm } from "./input-forms/AgentInputForm";

export class ResultDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.speedSum = 0;
        this.count = 0;
    }

    componentDidUpdate() {
        const {agentSpeed} = this.props
        this.speedSum += agentSpeed;
        this.count ++;
    }

    normalizeAgentSpeed = () => {
        const {agentSpeed} = this.props;
        return Math.round(agentSpeed * 30) * 2;
    }

    calculateAverageSpeed = () => {
        const avgSpeed = this.speedSum / this.count;
        return Math.round(avgSpeed * 30) * 2;
    }

    render = () => {
        return (
            <div className="form-style-5">
                <form>
                    <legend>
                        <span className="number"></span> Speed: {this.normalizeAgentSpeed()} km/h
                    </legend>
                    <legend>
                        <span className="number"></span> Avg Speed: {this.calculateAverageSpeed()} km/h
                    </legend>
                    <legend>
                        <span className="number"></span> Passed Cars: {this.props.passedCars}
                    </legend>
                </form>
                <AgentInputForm
                    showSensors={this.props.showSensors}
                    toggleShowSensors={this.props.toggleShowSensors}
                />
            </div>
        );
    }
}