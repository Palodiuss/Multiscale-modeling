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
			gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
		}
  }
  
  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy
    })
  }

  seed = () => {
    
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i=0; i<this.seeds; ) {
      let x = Math.floor(Math.random() * this.rows);
      let y = Math.floor(Math.random() * this.cols);

      if (gridCopy[x][y] === false)
        gridCopy[x][y] = true;
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
    let grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.setState({
      gridFull: grid,
   })
  }

  play = () => {
    let flag = true;
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    
    for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
        let count = 0;
        
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
	
	
        if (!g[i][j]) 
        {
          flag = false;
          if (count > 0)
            g2[i][j] = true;
        }
      }
    }

    if (flag) clearInterval(this.intervalId);
    
  
		this.setState({
      gridFull: g2,
    });
  }
  
  generateColor () {
    return '#' +  Math.random().toString(16).substr(-6);
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
		const width = (this.props.cols * 8);
		var rowsArr = [];

    var boxClass = "";
    var boxColor = "#000";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;

        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        boxColor = this.props.gridFull[i][j] ? "#FAB" : "#FFF";
        
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
    let style = {
      backgroundColor: this.props.boxColor
    }
		return (
			<div
        className={this.props.boxClass}
        
				id={this.props.boxId}
        onClick={this.selectBox}

        style={{style}}
        
			/>
		);
	}
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}


ReactDOM.render(<Main />, document.getElementById('root'));

