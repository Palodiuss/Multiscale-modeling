import React from 'react';
import Box from './Box';
import { Stage, Layer, Text } from 'react-konva';

export default class Grid extends React.Component {
	render() {
		var rowsArr = [];
    
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;
        
				rowsArr.push(
					<Box
            boxColor={this.props.gridFull[i][j]}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
            selectBox={this.props.selectBox}
					/>
				);
			}
		}

		return (
      <Stage width={this.props.width} height={this.props.width}>
        <Layer>
          {rowsArr}
        </Layer>
      </Stage>
		);
	}
}