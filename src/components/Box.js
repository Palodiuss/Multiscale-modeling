import React from "react";
import { Rect } from "react-konva";

export default class Box extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     hover: false,
  //   }
  // }

  shouldComponentUpdate(next) {
    return this.props.boxColor !== next.boxColor;
  }

  selectBox = e => {
    //e.preventDefault();

        this.props.selectBox(this.props.row, this.props.col);
        console.log(this.props.row);

  };

  // hoverOn = () => {
  //   this.setState({ hover: true });
  // }
  // hoverOff = () => {
  //   this.setState({ hover: false });
  // }

  render() {
    var { col, row, boxColor } = this.props;
    return (
      <Rect
        x={row * 5}
        y={col * 5}
        width={5}
        height={5}
        fill={boxColor}
        onClick={this.selectBox}
      />
    );
  }
}
