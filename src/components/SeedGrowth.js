import React from "react";
import Files from "react-files";
import Energy from './Energy.js';
import generateColor from "./GenerateColor.js";
import Buttons from "./Buttons.js";
import Grid from "./Grid.js";
import arrayClone from "./ArrayClone.js";
import mostFrequent from "./MostFrequent.js";

export default class SeedGrowth extends React.Component {
  constructor(props) {
    super(props);
    this.rows = 100;
    this.cols = 100;
    this.seeds = 10;
    this.width = this.cols * 5;
    this.number = 0;
    this.enabled = false;
    this.state = {
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill("#FFF")),
      energyArr: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(0)),
      finished: false,
      inclusionsType: "square",
      inclusionsNumber: 15,
      inclusionsRadius: 1,
      growthType: "CA"
    };

    this.fileReader = new FileReader();
    this.fileReader.onload = event => {
      this.setState(
        {
          gridFull: JSON.parse(event.target.result),
          finished: this.chekIfFinished()
        },
        () => {}
      );
    };
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);

    if (gridCopy[row][col] === "#FFF") {
      gridCopy[row][col] = generateColor();
    } else {
      gridCopy[row][col] = "#FFF";
    }

    this.setState({
      gridFull: gridCopy
    });
  };

  selectPhase = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    let phase = gridCopy[row][col];

    for (let i=0; i<100; i++)
      for (let j=0; j<100; j++)
        if (gridCopy[i][j] === phase)
          gridCopy[i][j] = "#000";

    this.setState({
      gridFull: gridCopy
    });
  };

  seed = () => {
    this.enabled = true;
    let gridCopy = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.state.inclusionsNumber; ) {
      let x = Math.floor(Math.random() * this.rows);
      let y = Math.floor(Math.random() * this.cols);

      if (gridCopy[x][y] === "#FFF") gridCopy[x][y] = generateColor();
      i++;
    }

    this.setState({
      gridFull: gridCopy,
      finished: true
    });
  };

  seedMC = () => {
    this.enabled = true;
    let gridCopy = arrayClone(this.state.gridFull);
    let mcArray = [];
    const colors = [];
    for (let i =0; i<this.state.inclusionsNumber; i++) {
      colors.push(generateColor());
    }

    for (let i=0; i<100; i++){
      for (let j=0; j<100; j++){
        if (gridCopy[i][j] !== "#000")
          mcArray.push({x: i, y: j});
        }
      }

    while (mcArray.length > 0) {
      let x = Math.floor(Math.random() * mcArray.length);
      gridCopy[mcArray[x].x][mcArray[x].y] = colors[Math.floor(Math.random()*this.state.inclusionsNumber)];
      mcArray.splice(x, 1);
    }

    this.setState({
      gridFull: gridCopy
    });
  };

  addInclusionsSquare = () => {
    let radius = this.state.inclusionsRadius - 1;
    let gridCopy = arrayClone(this.state.gridFull);

    if (this.state.finished === false) {
      for (let i = 0; i < this.state.inclusionsNumber; ) {
        let x = Math.floor(Math.random() * (this.rows - 2 * radius)) + radius;
        let y = Math.floor(Math.random() * (this.cols - 2 * radius)) + radius;

        if (gridCopy[x][y] === "#FFF") {
          if (this.checkNeighboursSquare(x, y, radius, gridCopy)) {
            for (let j = x - radius; j < x + radius; j++)
              for (let k = y - radius; k < y + radius; k++)
                gridCopy[j][k] = "#000";
            i++;
          }
        }
      }
    } else {
      for (let i = 0; i < this.state.inclusionsNumber; ) {
        let x = Math.floor(Math.random() * (this.rows - 2 * radius)) + radius;
        let y = Math.floor(Math.random() * (this.cols - 2 * radius)) + radius;
        let cellColor = gridCopy[x][y];

        if (
          cellColor !== gridCopy[x - 1][y] ||
          cellColor !== gridCopy[x][y - 1] ||
          cellColor !== gridCopy[x + 1][y] ||
          cellColor !== gridCopy[x][y + 1]
        ) {
          if (this.checkNeighboursSquare(x, y, radius, gridCopy)) {
            for (let j = x - radius; j < x + radius; j++)
              for (let k = y - radius; k < y + radius; k++)
                gridCopy[j][k] = "#000";
            i++;
          }
        }
      }
    }
    this.setState({
      gridFull: gridCopy
    });
  };

  checkNeighboursSquare = (x, y, z, gridCopy) => {
    let flag = true;
    for (let i = x - z; i < x + z; i++)
      for (let j = y - z; j < y + z; j++)
        if (gridCopy[i][j] === "#000") flag = false;

    return flag;
  };

  addInclusionsRound = () => {
    let radius = this.state.inclusionsRadius - 1;
    let gridCopy = arrayClone(this.state.gridFull);

    if (this.state.finished === false) {
      for (let i = 0; i < this.state.inclusionsNumber; ) {
        let x = Math.floor(Math.random() * (this.rows - 2 * radius)) + radius;
        let y = Math.floor(Math.random() * (this.cols - 2 * radius)) + radius;

        if (gridCopy[x][y] === "#FFF") {
          if (this.checkNeighboursRound(x, y, radius, gridCopy)) {
            for (let j = x - radius; j <= x + radius; j++)
              for (let k = y - radius; k <= y + radius; k++) {
                if ((j - x) * (j - x) + (k - y) * (k - y) <= radius * radius)
                  gridCopy[j][k] = "#000";
              }
            i++;
          }
        }
      }
    } else {
      for (let i = 0; i < this.state.inclusionsNumber; ) {
        let x = Math.floor(Math.random() * (this.rows - 2 * radius)) + radius;
        let y = Math.floor(Math.random() * (this.cols - 2 * radius)) + radius;
        let cellColor = gridCopy[x][y];

        if (
          cellColor !== gridCopy[x - 1][y] ||
          cellColor !== gridCopy[x][y - 1] ||
          cellColor !== gridCopy[x + 1][y] ||
          cellColor !== gridCopy[x][y + 1]
        ) {
          if (this.checkNeighboursRound(x, y, radius, gridCopy)) {
            for (let j = x - radius; j <= x + radius; j++)
              for (let k = y - radius; k <= y + radius; k++) {
                if ((j - x) * (j - x) + (k - y) * (k - y) <= radius * radius)
                  gridCopy[j][k] = "#000";
              }
            i++;
          }
        }
      }
    }

    this.setState({
      gridFull: gridCopy
    });
  };

  checkNeighboursRound = (x, y, z, gridCopy) => {
    let flag = true;
    for (let i = x - z; i < x + z; i++)
      for (let j = y - z; j < y + z; j++)
        if (
          (i - x) * (i - x) + (j - y) * (j - y) <= z * z &&
          gridCopy[i][j] === "#000"
        )
          flag = false;

    return flag;
  };

  chekIfFinished = () => {
    let flag = true;
    for (let i = 0; i < this.cols; i++)
      for (let j = 0; j < this.rows; j++)
        if (this.state.gridFull[i][j] === "#FFF") flag = false;

    this.setState({
      finished: flag
    });
  };

  boundariesButton = () => {
    var gridCopy = arrayClone(this.state.gridFull);
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let cellColor = gridCopy[x][y];
        if (cellColor !== "#FFF" && cellColor !== "#000") {
          if (x < this.cols - 1)
            if (
              cellColor !== gridCopy[x + 1][y] &&
              (gridCopy[x + 1][y] !== "#FFF" && gridCopy[x + 1][y] !== "#000")
            ) {
              gridCopy[x][y] = "#000";
            }
          if (y < this.rows - 1)
            if (
              cellColor !== gridCopy[x][y + 1] &&
              (gridCopy[x][y + 1] !== "#FFF" && gridCopy[x][y + 1] !== "#000")
            ) {
              gridCopy[x][y] = "#000";
            }
        }
      }
    }

    this.setState({
      gridFull: gridCopy
    });
  };

  clear = () => {
    this.enabled = false;
    let gridCopy = arrayClone(this.state.gridFull);
    if (this.state.growthType === "DP"){
      for (let i=0; i<100; i++){
        for (let j=0; j<100; j++)
          if (gridCopy[i][j] !== "#000")
            gridCopy[i][j] = "#FFF";          
        }
      }
    else {
      for (let i=0; i<100; i++)
        for (let j=0; j<100; j++)
          gridCopy[i][j] = "#FFF";
      }

      this.setState({
        gridFull: gridCopy,
        finished: false
      })
    
  };

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
          if (g[i][j] === "#FFF") {
            flag = true;

            let neighbours = [];

            if (i > 0)
              if (g[i - 1][j] !== "#FFF" && g[i - 1][j] !== "#000") {
                neighbours.push(g[i - 1][j]);
              }
            if (j < this.cols - 1)
              if (g[i][j + 1] !== "#FFF" && g[i][j + 1] !== "#000") {
                neighbours.push(g[i][j + 1]);
              }
            if (j > 0)
              if (g[i][j - 1] !== "#FFF" && g[i][j - 1] !== "#000") {
                neighbours.push(g[i][j - 1]);
              }
            if (i < this.rows - 1)
              if (g[i + 1][j] !== "#FFF" && g[i + 1][j] !== "#000") {
                neighbours.push(g[i + 1][j]);
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
  };

  playMC = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    let mcArray = [];
    let x, y;
    let neighboursOld;
    let neighboursNew;

    for (let k = 0; k < this.state.inclusionsRadius; k++){
      for (let i=0; i<100; i++){
        for (let j=0; j<100; j++){
          mcArray.push({x: i, y: j});
        }
      }
      for (let i = 0; i<10000; i++){
        let rnd = Math.floor(Math.random() * (mcArray.length));
        let color;
        while(true){
        color = gridCopy[Math.floor(Math.random()*100)][Math.floor(Math.random()*100)];
        if (color !== "#000")
          break;
        }
        x = mcArray[rnd].x;
        y = mcArray[rnd].y;
        neighboursNew = 0;
        neighboursOld = 0;      

          //Calculate energy
          if (x > 0){
            if (gridCopy[x - 1][y] !== gridCopy[x][y]) {
              ++neighboursOld;
            }
            if (gridCopy[x - 1][y] !== color) {
              ++neighboursNew;
            }
          }
          if (y < 99){
            if (gridCopy[x][y + 1] !== gridCopy[x][y]) {
              ++neighboursOld;
            }
            if (gridCopy[x][y + 1] !== color) {
              ++neighboursNew;
            }
          }
          if (y > 0){
            if (gridCopy[x][y - 1] !== gridCopy[x][y]) {
              neighboursOld++;
            }
            if (gridCopy[x][y - 1] !== color) {
              ++neighboursNew;
            }
          }
          if (x < 99){
            if (gridCopy[x + 1][y] !== gridCopy[x][y]) {
              ++neighboursOld;
            }
            if (gridCopy[x + 1][y] !== color) {
              ++neighboursNew;
            }
          }

          if (x>0 && y>0){
            if (gridCopy[x-1][y-1] !== gridCopy[x][y]) {
              neighboursOld++;
            }
            if (gridCopy[x-1][y-1] !== color) {
              ++neighboursNew;
            }
          }
          if (x>0 && y < 99){
            if (gridCopy[x-1][y+1] !== gridCopy[x][y]) {
              ++neighboursOld;
            }
            if (gridCopy[x-1][y+1] !== color) {
              ++neighboursNew;
            }
          }
          if (x < 99 && y>0){
            if (gridCopy[x+1][y-1] !== gridCopy[x][y]) {
              ++neighboursOld;
            }
            if (gridCopy[x+1][y-1] !== color) {
              ++neighboursNew;
            }
          }
          if (x < 99 && y < 99){
            if (gridCopy[x+1][y+1] !== gridCopy[x][y]) {
              ++neighboursOld;
            }
            if (gridCopy[x+1][y+1] !== color) {
              ++neighboursNew;
            }
          }

          if (neighboursNew < neighboursOld) {
            gridCopy[x][y] = color;
          }

        mcArray.splice(rnd, 1);        
    }
  }
    
    this.setState({
      gridFull: gridCopy,
    });
  };

  energyButton = () => {
    let energyCopy = [...Array(100)].map(x=>Array(100).fill(this.state.inclusionsRadius));
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let cellColor = this.state.gridFull[x][y];
        if (cellColor !== "#FFF" && cellColor !== "#000") {
          if (x < this.cols - 1)
            if (
              cellColor !== this.state.gridFull[x + 1][y] &&
              (this.state.gridFull[x + 1][y] !== "#FFF" && this.state.gridFull[x + 1][y] !== "#000")
            ) {
              energyCopy[x][y] = this.state.inclusionsNumber; 
            }
          if (y < this.rows - 1)
            if (
              cellColor !== this.state.gridFull[x][y + 1] &&
              (this.state.gridFull[x][y + 1] !== "#FFF" && this.state.gridFull[x][y + 1] !== "#000")
            ) {
              energyCopy[x][y] = this.state.inclusionsNumber; 
            }
        }
      }
    }
  this.setState({
    energyArr: energyCopy
  });
};

  onSave = () => {
    var element = document.createElement("a");
    const json = JSON.stringify(this.state.gridFull);
    var blob = new Blob([json], { type: "application/json" });
    element.href = URL.createObjectURL(blob);
    element.download = "microstructure.json";
    element.click();
  };

  render() {
    return (
      <div>
        <h1 className="title-header" style={{ width: this.width }}>
          Microstructure simulator
        </h1>
        <div className="centerGrid">
          <Grid
            gridFull={this.state.gridFull}
            rows={this.rows}
            cols={this.cols}
            selectBox={this.selectPhase}
            width={this.width}
          />
          <Energy
          energyArr={this.state.energyArr}
          rows={this.rows}
          cols={this.cols}
          width={this.width}
        />
        </div>

        <div className="button-toolbar">
          <Buttons
            playButton={this.state.growthType === "CA"
            ? this.play
            : this.playMC}
            clearButton={this.clear}
            seedButton={this.state.growthType === "CA"
            ? this.seed
            : this.seedMC}
            inclusionsButton={
              this.state.inclusionsType === "square"
                ? this.addInclusionsSquare
                : this.addInclusionsRound
            }
            boundariesButton={this.boundariesButton}
            energyButton={this.energyButton}
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
          <input
            type="text"
            value={this.state.inclusionsNumber}
            onChange={e => {
              this.setState({
                inclusionsNumber: e.target.value
              });
            }}
          />
          <select
            value={this.state.inclusionsType}
            onChange={e => {
              this.setState({
                inclusionsType: e.target.value
              });
            }}
          >
            <option value="square">square</option>
            <option value="round">round</option>
          </select>
          <input
            type="text"
            value={this.state.inclusionsRadius}
            onChange={e => {
              this.setState({
                inclusionsRadius: e.target.value
              });
            }}
          />
                    <select
            value={this.state.growthType}
            onChange={e => {
              this.setState({
                growthType: e.target.value
              });
            }}
          >
            <option value="CA">ca</option>
            <option value="MC">mc</option>
            <option value="DP">dp</option>
          </select>

          
        </div>
      </div>
    );
  }
}
