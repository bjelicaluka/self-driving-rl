import React from 'react'
import { CONFIG } from './config';
import Sketch from 'react-p5';
import { CarsView } from './view/CarsView';
import { LanesView } from './view/LanesView';

export class Environment extends React.Component {
    constructor(props) {
        super(props);
        this.lanesView = null;
        this.carsView = null;
    }

    preload = (p5) => {
        this.lanesView = new LanesView(p5);
        this.carsView = new CarsView(p5);
        this.carsView.loadImages();
    }
    
    setup = (p5, canvasParentRef) => {
        const {CANVAS_HEIGHT, CANVAS_WIDTH} = CONFIG;
        p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).parent(canvasParentRef);
    };

    draw = p5 => {
        this.setBackground(p5);

        this.drawElements();
    };

    setBackground = (p5) => {
        const BLACK = 0;
        p5.background(BLACK);
    }

    drawElements = () => {
        const {speed, cars} = this.props;
        this.lanesView.draw(speed);
        this.carsView.draw(cars, this.props.showSensors);
    }

    render() {
        return (
            <Sketch 
                setup={this.setup} 
                draw={this.draw} 
                preload={this.preload}
                mousePressed={this.props.handleMousePressed}
                keyPressed={this.props.keyPressed}
            />
        )
    }
}