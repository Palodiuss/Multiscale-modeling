import React from 'react';

export default class Buttons extends React.Component {
  render() {
    return (
      <div className="button-toolbar">

            <button className="btn" onClick={this.props.playButton}>
              Play
            </button>
            <button className="btn" onClick={this.props.pauseButton}>
              pause
            </button>
            <button className="btn" onClick={this.props.clearButton}>
              clear
            </button>
            <button className="btn" onClick={this.props.seedButton}>
            seed
            </button>
            <button className="btn" onClick={this.props.saveButton}>
            save
            </button>
            <button className="btn" onClick={this.props.loadButton}>
            load
            </button>
            <button className="btn" onClick={this.props.onSave}>
            Save File
            </button>


       
      </div>
    )
  }
}