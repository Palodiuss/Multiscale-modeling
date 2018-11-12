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
		this.rows = 100;
    this.cols = 100;
    this.seeds = 10;
    // this.selectBox = this.selectBox.bind(this);
    // this.seed = this.seed.bind(this);
    // this.clear = this.clear.bind(this);
    // this.save = this.save.bind(this);
    // this.load = this.load.bind(this);
    // this.play = this.play.bind(this);
    // this.onSave = this.onSave.bind(this);
    this.width = this.cols * 5;
    this.number = 0;
    this.enabled = false;

		this.state = {
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill("#FFF")),
      finished: false,
      inclusionsType: 'square',
      inclusionsNumber: 15,
      inclusionsRadius: 3
    }

    this.fileReader = new FileReader();
    this.fileReader.onload = event => {
      this.setState({ gridFull: JSON.parse(event.target.result),
      finished: this.chekIfFinished() }, () => {
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
    this.enabled = true;
    let gridCopy = arrayClone(this.state.gridFull);

    for (let i=0; i<this.state.inclusionsNumber; ) {
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

  addInclusionsSquare = () => {  
    let radius = this.state.inclusionsRadius-1;
    let gridCopy = arrayClone(this.state.gridFull);

    if (this.state.finished === false) {
      for (let i=0; i<this.state.inclusionsNumber; ) {
        
        let x = Math.floor(Math.random() * (this.rows-(2*radius))) + radius;
        let y = Math.floor(Math.random() * (this.cols-(2*radius))) + radius;

        if (gridCopy[x][y] === "#FFF"){          
          if (this.checkNeighboursSquare(x, y, radius, gridCopy))
          {            
            for (let j=x-radius; j<x+radius; j++)
              for (let k=y-radius; k<y+radius; k++)
                gridCopy[j][k] = "#000";
            i++;
          }
        }
      }
    }
    else {    
        for (let i=0; i<this.state.inclusionsNumber; ) {
          let x = Math.floor(Math.random() * (this.rows-(2*radius))) + radius;
          let y = Math.floor(Math.random() * (this.cols-(2*radius))) + radius;
          let cellColor = gridCopy[x][y];

          if (
            cellColor !== gridCopy[x-1][y] ||
            cellColor !== gridCopy[x][y-1] ||
            cellColor !== gridCopy[x+1][y] ||
            cellColor !== gridCopy[x][y+1]
          )
          {           
            if (this.checkNeighboursSquare(x, y, radius, gridCopy))
            {            
              for (let j=x-radius; j<x+radius; j++)
                for (let k=y-radius; k<y+radius; k++)
                  gridCopy[j][k] = "#000";
              i++;
            }
          }
        }
  }
  this.setState({
    gridFull:  gridCopy
  })
}

  checkNeighboursSquare = (x, y, z, gridCopy) => {
    let flag = true;
    for (let i=x-z; i<x+z; i++)
      for (let j=y-z; j<y+z; j++)
        if (gridCopy[i][j] === "#000")
          flag = false;
    
    return flag;
  }

  addInclusionsRound = () => {  
    let radius = this.state.inclusionsRadius-1;
    let gridCopy = arrayClone(this.state.gridFull);

    if (this.state.finished === false) {
      for (let i=0; i<this.state.inclusionsNumber; ) {
        
        let x = Math.floor(Math.random() * (this.rows-(2*radius))) + radius;
        let y = Math.floor(Math.random() * (this.cols-(2*radius))) + radius;

        if (gridCopy[x][y] === "#FFF"){          
          if (this.checkNeighboursRound(x, y, radius, gridCopy))
          {            
            for (let j=x-radius; j<=x+radius; j++)
              for (let k=y-radius; k<=y+radius; k++)
              {
                if ( ((j-x)*(j-x)) + ((k-y)*(k-y)) <= ((radius)*(radius)) )
                  gridCopy[j][k] = "#000";
              }
            i++;
          }
        }
      }
    }
    else {    
        for (let i=0; i<this.state.inclusionsNumber; ) {
          let x = Math.floor(Math.random() * (this.rows-(2*radius))) + radius;
          let y = Math.floor(Math.random() * (this.cols-(2*radius))) + radius;
          let cellColor = gridCopy[x][y];

          if (
            cellColor !== gridCopy[x-1][y] ||
            cellColor !== gridCopy[x][y-1] ||
            cellColor !== gridCopy[x+1][y] ||
            cellColor !== gridCopy[x][y+1]
          )
          {           
            if (this.checkNeighboursRound(x, y, radius, gridCopy))
            {            
              for (let j=x-radius; j<=x+radius; j++)
                for (let k=y-radius; k<=y+radius; k++)
                {
                  if ( ((j-x)*(j-x)) + ((k-y)*(k-y)) <= ((radius)*(radius)) )
                    gridCopy[j][k] = "#000";
                }
              i++;
            }
          }
        }
  }

  this.setState({
    gridFull:  gridCopy
  })
}

checkNeighboursRound = (x, y, z, gridCopy) => {
  let flag = true;
  for (let i=x-z; i<x+z; i++)
    for (let j=y-z; j<y+z; j++)
      if (((( (i-x)*(i-x) ) + ( (j-y)*(j-y) )) <= (z*z) ) && (gridCopy[i][j] === "#000") )
        flag = false;
  
  return flag;
}

chekIfFinished = () => {
  let flag = true;
  for (let i=0; i<this.cols; i++)
    for (let j=0; j<this.rows; j++)
      if (this.state.gridFull[i][j] === '#FFF')
        flag = false

  this.setState({
    finished: flag
  })
}
 


  clear = () => {
    this.enabled = false;
    let grid = Array(this.rows).fill().map(() => Array(this.cols).fill("#FFF"));
    this.setState({
      gridFull: grid,
      finished: false
   })
  }

  // save = () => {
  //   const json = JSON.stringify(this.state.gridFull);
  //   localStorage.setItem('grid', json);      
  // }
  

  // load = () => {
  //   const json = localStorage.getItem('grid');
  //   const gridFull = JSON.parse(json);
  //   if (gridFull) {
  //     this.setState(() => ({gridFull}))
  //   }
  // }

  play = () => {
    var flag = this.enabled;
    var g = this.state.gridFull;
    var g2 = arrayClone(this.state.gridFull);

    while (flag) {
    flag = false;  
    for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
        
        if (g[i][j] === "#FFF"){
          flag = true;

          let neighbours = [];
          
          if (i > 0) if (g[i - 1][j]!=="#FFF" && g[i - 1][j]!=="#000" ) 
          {
            neighbours.push(g[i-1][j])
          }
          if (j < this.cols - 1) if (g[i][j + 1]!=="#FFF" && g[i][j+1]!=="#000" ) 
          {
            neighbours.push(g[i][j+1]);
          }
          if (j > 0) if (g[i][j - 1]!=="#FFF"&& g[i][j-1]!=="#000" ) 
          {
            neighbours.push(g[i][j-1]); 
          }
          if (i < this.rows - 1) if (g[i + 1][j]!=="#FFF" && g[i + 1][j]!=="#000" ) 
          {
            neighbours.push(g[i+1][j]);
          } 
          if (neighbours.length > 0) g2[i][j] = mostFrequent(neighbours);                 
        }
      }
    }
    g = arrayClone(g2);
  }

		this.setState({
      gridFull: g2,
      finished: true
    });
  
  }
  
 
  onSave = () =>  {
    var element = document.createElement("a");
    const json = JSON.stringify(this.state.gridFull);
    var blob = new Blob([json], {type: "application/json"});
    element.href = URL.createObjectURL(blob);
    element.download = "microstructure.json";
    element.click();
  }


  render () {
    return (
      <div>
        <h1 className="title-header" style={{width: this.width}}>Seed Growth</h1>
        <div className="centerGrid">
          <Grid
            gridFull={this.state.gridFull}
            rows={this.rows}
            cols={this.cols}
            selectBox={this.selectBox}
            width={this.width}
          />
        </div>

        <div className="button-toolbar">
          <Buttons 
            playButton={this.play}
            clearButton={this.clear}
            seedButton={this.seed}
            inclusionsButton={this.state.inclusionsType === 'square' ? this.addInclusionsSquare : this.addInclusionsRound} 
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
      <div className="button-toolbar">
        <input type="text" value={this.state.inclusionsNumber} onChange={(e)=>{
          this.setState({
            inclusionsNumber: e.target.value
          })
        }}/>
        <select value={this.state.inclusionsType}
                onChange={(e)=>{
                  this.setState({
                    inclusionsType: e.target.value
                  })
                }}
        >
          <option value="square">square</option>
          <option value="round">round</option>
        </select>
        <input type="text" value={this.state.inclusionsRadius} onChange={(e)=>{
          this.setState({
            inclusionsRadius: e.target.value
          })
        }}/>
      </div>

      </div>
    )
  }
}