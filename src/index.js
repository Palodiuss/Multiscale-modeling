import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar } from 'react-bootstrap';

class Main extends React.Component {
  constructor() {
		super();
		this.speed = 10;
		this.rows = 100;
    this.cols = 100;
    this.seeds = 10;
    

		this.state = {
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
      gridColors: Array(this.rows).fill().map(() => Array(this.cols).fill("#FFF"))
		}
  }
  
  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    let colorCopy = arrayClone(this.state.gridColors);

    if (gridCopy[row][col]) {
      colorCopy[row][col] = "FFF"
    }
    else {
      colorCopy[row][col] = generateColor();
    }

    gridCopy[row][col] = !gridCopy[row][col];



    this.setState({
      gridFull: gridCopy,
      gridColors: colorCopy
    })
  }

  seed = () => {
    
    let gridCopy = arrayClone(this.state.gridFull);
    let colorCopy = arrayClone(this.state.gridColors);
    for (let i=0; i<this.seeds; ) {
      let x = Math.floor(Math.random() * this.rows);
      let y = Math.floor(Math.random() * this.cols);

      if (gridCopy[x][y] === false)
        gridCopy[x][y] = true;
        colorCopy[x][y] = generateColor();
        i++;
    }

    this.setState({
      gridFull:  gridCopy,
      gridColors: colorCopy
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
    let grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    let colors = Array(this.rows).fill().map(() => Array(this.cols).fill("#FFF"));
    this.setState({
      gridFull: grid,
      gridColors: colors,
   })
  }

  play = () => {
    let flag = true;
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);
    let c = this.state.gridColors;
    let c2 = arrayClone(this.state.gridColors);

    for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {

        
        
        if (!g[i][j]){
          let neighbours = [];
          flag = false;
          if (i > 0) if (g[i - 1][j]) {
            g2[i][j] = true;
            neighbours.push(c[i-1][j])
            //c2[i][j] = c[i-1][j];
          }
          if (j < this.cols - 1) if (g[i][j + 1]) {
            g2[i][j] = true;
            neighbours.push(c[i][j+1]);
            //c2[i][j] = c[i][j+1];
          }
          if (j > 0) if (g[i][j - 1]) {
            g2[i][j] = true;
            neighbours.push(c[i][j-1]); 
            //c2[i][j] = c[i][j-1]; 
          }
          if (i < this.rows - 1) if (g[i + 1][j]) {
            g2[i][j] = true;
            neighbours.push(c[i+1][j]);
            //c2[i][j] = c[i+1][j];
          } 
          if (neighbours.length > 0) c2[i][j] = neighbours[mostFrequent(neighbours)];
          
        }
      }
    }

    if (flag) clearInterval(this.intervalId);
		this.setState({
      gridFull: g2,
      gridColors: c2
    });
  
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
        />
				<Grid
          gridFull={this.state.gridFull}
          gridColors={this.state.gridColors}
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
          </ButtonToolbar>        
      </div>
    )
  }
}

class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 9);
		var rowsArr = [];

    var boxClass = "box";
    var boxColor = "#FFF";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;

        if (this.props.gridFull[i][j]){
          boxColor = {
            backgroundColor: `${this.props.gridColors[i][j]}`
          }
        }
        else {
          boxColor = {
            backgroundColor: `${this.props.gridColors[i][j]}`
          }
        }
      
     
        
				rowsArr.push(
					<Box
            boxClass={boxClass}
            boxColor={boxColor}
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
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}

	render() {
    // var divStyle = {
    //   backgroundColor: {this.props.boxColor}
    // };
		return (
			<div
        className={this.props.boxClass}
        
				id={this.props.boxId}
        onClick={this.selectBox}

        style={this.props.boxColor}
        
			/>
		);
	}
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

function mostFrequent(arr) {
  let max = 0;
  let mode = '';
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
 console.log(mode);
 return arr[mode];

}

function generateColor () {
  return '#' +  Math.random().toString(16).substr(-6);
}


ReactDOM.render(<Main />, document.getElementById('root'));

