import React from 'react';
export default class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    }
  }

	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
  }
  
  hoverOn = () => {
    this.setState({ hover: true });
  }
  hoverOff = () => {
    this.setState({ hover: false });
  }

	render() {
		return (
			<div
        className="box"        
				id={this.props.boxId}
        onClick={this.selectBox}
        onMouseEnter={this.hoverOn} 
        onMouseLeave={this.hoverOff}

        style={this.state.hover ? this.props.boxColorHover : this.props.boxColor}
        
			/>
		);
	}
}