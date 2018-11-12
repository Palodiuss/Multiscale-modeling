import React from 'react';
import Files from 'react-files';
import Input from './Input.js';
import generateColor from './GenerateColor.js';
import Buttons from './Buttons.js';
import Grid from './Grid.js';
import arrayClone from './ArrayClone.js';
import mostFrequent from './MostFrequent.js';


export default class SeedGrowth extends React.Component {
  constructor(props) {
		super(props);
		this.speed = 100;
		this.rows = 50;
    this.cols = 50;
    this.seeds = 10;
    this.selectBox = this.selectBox.bind(this);


    this.width = this.cols * 12;

		this.state = {
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill("#FFF")),
      colors: []
    }

    this.fileReader = new FileReader();
    this.fileReader.onload = event => {
      this.setState({ gridFull: JSON.parse(event.target.result) }, () => {
        console.log(this.state.jsonFile);
      });
    };
  }
  


  
  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);

    if (gridCopy[row][col] === "#FFF") {
        gridCopy[row][col] = generateColor();
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
        gridCopy[x][y] = generateColor();
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
            g2[i][j] = generateColor();
            neighbours.push(g[i-1][j])
          }
          if (j < this.cols - 1) if (g[i][j + 1]!=="#FFF") {
            g2[i][j] = generateColor();
            neighbours.push(g[i][j+1]);
          }
          if (j > 0) if (g[i][j - 1]!=="#FFF") {
            g2[i][j] = generateColor();
            neighbours.push(g[i][j-1]); 
          }
          if (i < this.rows - 1) if (g[i + 1][j]!=="#FFF") {
            g2[i][j] = generateColor();
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
  
 
  onSave() {
    clearInterval(this.intervalId); 
    var element = document.createElement("a");
    const json = JSON.stringify(this.state.gridFull);
    var blob = new Blob([json], {type: "application/json"});
    element.href = URL.createObjectURL(blob);
    element.download = "seedGrowthSave.json";
    element.click();
  }


  render () {
    return (
      <div>
        <h1 className="title-header" style={{width: this.width}}>Seed Growth</h1>

				<Grid
          gridFull={this.state.gridFull}
					rows={this.rows}
					cols={this.cols}
          selectBox={this.selectBox}
          width={this.width}
        />

        <div className="button-toolbar">
          <Buttons 
            playButton={this.playButton}
            pauseButton={this.pauseButton}
            clearButton={this.clear}
            seedButton={this.seed} 
            saveButton={this.save}
            loadButton={this.load} 
            onSave={this.onSave}   
              
          />
          <Files
          onChange={file => {
            this.fileReader.readAsText(file[0]);
          }}
          onError={err => console.log(err)}
          accepts={[".json"]}
          multiple={false}
      
          >
          <button className="btn">Load file</button>
        </Files>
      </div>

      </div>
    )
  }
}