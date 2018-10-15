import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { ButtonToolbar } from 'react-bootstrap';

class Main extends React.Component {
  constructor(props) {
		super(props);
		this.speed = 100;
		this.rows = 50;
    this.cols = 50;
    this.seeds = 10;
    this.selectBox = this.selectBox.bind(this);
    this.seed = this.seed.bind(this);
    this.playButton = this.playButton.bind(this);
    this.pauseButton = this.pauseButton.bind(this);
    this.clear = this.clear.bind(this);
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
    this.play = this.play.bind(this);

		this.state = {
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill("#FFF")),
      colors: []
		}
  }

  generateColor () {
    return '#' + Math.random().toString(16).slice(2, 8).toUpperCase();     
  }

  
  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);

    if (gridCopy[row][col] === "#FFF") {
        gridCopy[row][col] = this.generateColor();
    }
    else {
      gridCopy[row][col] = "#FFF"
    }

    this.setState({
      gridFull: gridCopy
    })

  }

  seed = () => {
    
    let gridCopy = arrayClone(this.state.gridFull);

    for (let i=0; i<this.seeds; ) {
      let x = Math.floor(Math.random() * this.rows);
      let y = Math.floor(Math.random() * this.cols);

      if (gridCopy[x][y] === "#FFF")
        gridCopy[x][y] = this.generateColor();
        i++;
    }

    this.setState({
      gridFull:  gridCopy
    })
  }

  playButton = () => {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(this.play, this.speed);
  }

  pauseButton = () => {
    clearInterval(this.intervalId);
  }

  clear = () => {
    clearInterval(this.intervalId);
    let grid = Array(this.rows).fill().map(() => Array(this.cols).fill("#FFF"));
    this.setState({
      gridFull: grid
   })
  }

  save = () => {
    clearInterval(this.intervalId); 
    const json = JSON.stringify(this.state.gridFull);
    localStorage.setItem('grid', json);      
  }
  

  load = () => {
    clearInterval(this.intervalId);
    const json = localStorage.getItem('grid');
    const gridFull = JSON.parse(json);
    if (gridFull) {
      this.setState(() => ({gridFull}))
    }
  }

  play = () => {
    let flag = true;
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
        
        if (g[i][j] === "#FFF"){
          let neighbours = [];
          flag = false;
          if (i > 0) if (g[i - 1][j]!=="#FFF") {
            g2[i][j] = this.generateColor();
            neighbours.push(g[i-1][j])
          }
          if (j < this.cols - 1) if (g[i][j + 1]!=="#FFF") {
            g2[i][j] = this.generateColor();
            neighbours.push(g[i][j+1]);
          }
          if (j > 0) if (g[i][j - 1]!=="#FFF") {
            g2[i][j] = this.generateColor();
            neighbours.push(g[i][j-1]); 
          }
          if (i < this.rows - 1) if (g[i + 1][j]!=="#FFF") {
            g2[i][j] = this.generateColor();
            neighbours.push(g[i+1][j]);
          } 
          if (neighbours.length > 0) g2[i][j] = mostFrequent(neighbours);          
        }
      }
    }

    if (flag) clearInterval(this.intervalId);
		this.setState({
      gridFull: g2
    });
  
  }
  
  onChange(e) {
    let files=e.target.files;
    console.log("file:",files);
  }


  render () {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Buttons 
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          clearButton={this.clear}
          seedButton={this.seed} 
          saveButton={this.save}
          loadButton={this.load}       
        />
        <input type="file" name="file" onChange={(e)=>this.onChange(e)}/>
				<Grid
          gridFull={this.state.gridFull}
					rows={this.rows}
					cols={this.cols}
					selectBox={this.selectBox}
				/>
      </div>
    )
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div className="center">
        <ButtonToolbar>
            <button className="btn btn-default" onClick={this.props.playButton}>
              Play
            </button>
            <button className="btn btn-default" onClick={this.props.pauseButton}>
              pause
            </button>
            <button className="btn btn-default" onClick={this.props.clearButton}>
              clear
            </button>
            <button className="btn btn-default" onClick={this.props.seedButton}>
            seed
            </button>
            <button className="btn btn-default" onClick={this.props.saveButton}>
            save
            </button>
            <button className="btn btn-default" onClick={this.props.loadButton}>
            load
            </button>
          </ButtonToolbar>        
      </div>
    )
  }
}

class Grid extends React.Component {
	render() {
    var boxColorHover = {backgroundColor: "#000"};
		const width = (this.props.cols * 8);
		var rowsArr = [];
    
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;
        
        var boxColor = {backgroundColor: `${this.props.gridFull[i][j]}`}
      
     
        
				rowsArr.push(
					<Box
            boxClass="box"
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
			<div className="grid" style={{width: width}}>
				{rowsArr}
			</div>
		);
	}
}

class Box extends React.Component {
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
        className={this.props.boxClass}
        
				id={this.props.boxId}
        onClick={this.selectBox}
        onMouseEnter={this.hoverOn} 
        onMouseLeave={this.hoverOff}

        style={this.state.hover ? this.props.boxColorHover : this.props.boxColor}
        
			/>
		);
	}
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

function mostFrequent(arr) {
  let max = 0;
  let mode = 0;
  let counter = 0;

  for(var i = 0; i < arr.length; i++){
    counter = 0;
    for (var j = 0; j < arr.length; j++)
    {
    if (arr[i] === arr[j]) {
      counter++
      if (counter > max) max = counter;
      mode = i;
    }    
  }
 }
 return arr[mode];

}

 


ReactDOM.render(<Main />, document.getElementById('root'));

