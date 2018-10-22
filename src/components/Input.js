import React from 'react';
export default class Input extends React.Component {
  render() {
    return (
      <div className="center">

      <label className="btn btn-default">      
        <input type="file" name="loadFile" id="saveFile" onChange={(e)=>this.props.onLoad(e)}/>
        Load File
        </label>
      </div>
      )
  }
}