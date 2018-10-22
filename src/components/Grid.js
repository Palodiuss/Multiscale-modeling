import React from 'react';
import Box from './Box';

export default class Grid extends React.Component {
	render() {
    var boxColorHover = {backgroundColor: "#212121"};
		var rowsArr = [];
    
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;
        
        var boxColor = {backgroundColor: `${this.props.gridFull[i][j]}`}
      
     
        
				rowsArr.push(
					<Box
            boxColor={boxColor}
            boxColorHover={boxColorHover}
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
			<div className="grid" style={{width: this.props.width}}>
				{rowsArr}
			</div>
		);
	}
}