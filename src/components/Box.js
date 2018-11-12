import React from 'react';
import {Rect} from 'react-konva';


export default class Box extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     hover: false,
  //   }
  // }

  shouldComponentUpdate(next) {
    return this.props.boxColor !== next.boxColor
  }

	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
  }
  
  // hoverOn = () => {
  //   this.setState({ hover: true });
  // }
  // hoverOff = () => {
  //   this.setState({ hover: false });
  // }

	render() {
    var {col ,row, boxColor} = this.props;
		return (
      <Rect 
        x={row*5}
        y={col*5}
        width={5}
        height={5}
        fill={boxColor}
        onClick={this.selectBox}
      />
      //   			<div
      //   className="box"        
			// 	id={this.props.boxId}
      //   onClick={this.selectBox}
      //   // onMouseEnter={this.hoverOn} 
      //   // onMouseLeave={this.hoverOff}

      //   style={this.props.boxColor}        
      // />

		);
	}
}