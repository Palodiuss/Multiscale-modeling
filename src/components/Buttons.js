import React from "react";

export default class Buttons extends React.Component {
  render() {
    return (
      <div className="button-toolbar">
        <button className="btn" onClick={this.props.playButton}>
          Play
        </button>
        <button className="btn" onClick={this.props.clearButton}>
          clear
        </button>
        <button className="btn" onClick={this.props.seedButton}>
          nukleons
        </button>
        <button className="btn" onClick={this.props.inclusionsButton}>
          inclusions
        </button>
        <button className="btn" onClick={this.props.boundariesButton}>
          boundaries
        </button>
        <button className="btn" onClick={this.props.onSave}>
          Save File
        </button>
      </div>
    );
  }
}
