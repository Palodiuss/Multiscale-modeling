import React from "react";
import Box from "./Box";
import { Stage, Layer } from "react-konva";
import generateColor from './GenerateColor';

export default class Energy extends React.Component {
  constructor(props) {
    super(props);
    this.colors = [];
    for (let i=0; i<20; i++){
      this.colors[i] = generateColor();
    }
  }
  

  render() {
    var rowsArr = [];

    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;

        rowsArr.push(
          <Box
            boxColor={this.colors[this.props.energyArr[i][j]]}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
          />
        );
      }
    }

    return (
      <Stage width={this.props.width} height={this.props.width}>
        <Layer>{rowsArr}</Layer>
      </Stage>
    );
  }
}


