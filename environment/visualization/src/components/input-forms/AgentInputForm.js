import React from "react"

export class AgentInputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false
        }
        
        this.props.trafficEventHandler.onPing(() => {
            this.setState({connected: true});
        });
    }

    renderConnectionStatus = () => {
        const style = this.state.connected ? "good five-bars" : "bad one-bar"
        return (
            <div className={"signal-bars mt1 sizing-box " + style} style={{marginLeft: 10}}>
                <div className="first-bar bar"></div>
                <div className="second-bar bar"></div>
                <div className="third-bar bar"></div>
                <div className="fourth-bar bar"></div>
                <div className="fifth-bar bar"></div>
            </div>
        )
    }

    render() {
        return (
            <fieldset>
                <legend>
                    <span className="number"></span> Agent
                    {this.renderConnectionStatus()}
                </legend>
                <input
                    type="checkbox"
                    checked={this.props.showSensors}
                    onChange={this.props.toggleShowSensors}
                />
                <span style={{padding: 0, paddingLeft: 10}}>Show Sensor Zones</span>
            </fieldset>
        )
    }

}