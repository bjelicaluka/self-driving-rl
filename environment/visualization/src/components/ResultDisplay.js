import React from "react";
import { AgentInputForm } from "./input-forms/AgentInputForm";

export class ResultDisplay extends React.Component {

    normalizeSpeed = (speed) => {
        return Math.round(speed * 30) * 2;
    }

    render = () => {
        const {speed, avgSpeed, passedCars} = this.props;
        return (
            <div className="form-style-5">
                <form>
                    <legend>
                        <span className="number"></span> Speed: {this.normalizeSpeed(speed)} km/h
                    </legend>
                    <legend>
                        <span className="number"></span> Avg Speed: {this.normalizeSpeed(avgSpeed)} km/h
                    </legend>
                    <legend>
                        <span className="number"></span> Passed Cars: {passedCars}
                    </legend>
                </form>
                <AgentInputForm
                    showSensors={this.props.showSensors}
                    toggleShowSensors={this.props.toggleShowSensors}
                    trafficEventHandler={this.props.trafficEventHandler}
                />
            </div>
        );
    }
}