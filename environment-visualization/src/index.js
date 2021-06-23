import React from "react";
import ReactDOM from "react-dom";
import SingleSimulation from "./SingleSimulation";

export default class MainWindow extends React.Component {
    constructor(props) {
        super(props);
        const pathname = window.location.pathname;
        const numberOfSimulations = pathname.substr(1, pathname.length - 1);
        const simulationIds = [];
        for (let i = 0; i < numberOfSimulations; i++) {
            simulationIds.push(`/${i}`);
        }
        this.state = {
            simulationIds
        };
    }

    render() {
        return (
            <div>
                {this.state.simulationIds.map((simulationNamespaceId, i) => 
                    <SingleSimulation key={i} simulationNamespaceId={simulationNamespaceId} />
                )}

            </div>
        );
    }
}

ReactDOM.render(<MainWindow />, document.getElementById("root"));