import React from "react";

export default class App extends React.Component {
  state = {
    grid: [],
  };

  gridSize = {
    row: 4,
    col: 4,
  };

  // Capacity value to modifies the allowed undos
  undoObject = { stack: [], capacity: 5, mutable: true };
  isGridSorted = false;
  moveCounter = 0;

  getInitialRandomState = () => {
    var newState;
    // Create an array to with all the values to be populated to grid which solvable
    do {
      const rangeArray = [];
      for (let index = 1; index < this.gridSize.row * this.gridSize.col; index++) rangeArray.push(index);

      // Create the grid with random values having no repetition
      newState = new Array(this.gridSize.row);
      for (let index = 0; index < newState.length; index++) newState[index] = [];
      for (let i = 0; i < newState.length; i++)
        for (let j = 0; j < newState.length; j++) newState[i][j] = rangeArray.splice(Math.floor(Math.random() * rangeArray.length), 1)[0];

      newState[this.gridSize.row - 1][this.gridSize.col - 1] = null;
    } while (!this.isSolvable(newState.flat()));

    return newState;
  };

  isSolvable = (newState) => {
    var invCount = 0;
    // count pairs(i, j) such that i appears before j, but i > j.
    for (let i = 0; i < this.gridSize.row * this.gridSize.col - 1; i++) {
      for (let j = i + 1; j < this.gridSize.row * this.gridSize.col; j++) {
        if (newState[j] && newState[i] && newState[i] > newState[j]) invCount++;
      }
    }
    return invCount % 2 === 0 ? true : false;
  };

  componentDidMount() {
    this.onResetClickHandler();
  }

  onResetClickHandler = () => {
    this.setState({
      grid: this.getInitialRandomState(),
    });

    this.nullIndex = {
      row: this.gridSize.row - 1,
      col: this.gridSize.col - 1,
    };

    this.undoObject.stack = [];
    this.moveCounter = 0;
  };

  onBoxClickHandler = (event) => {
    const target = event.target;
    const digit = +target.dataset.digit;
    const { newState, gridDirection } = this.getStateAndDirectionOnBoxMove(this.state, this.nullIndex.row, this.nullIndex.col, digit);

    if (gridDirection) {
      target.classList.add("move-" + gridDirection);
      this.updateUndoObject(digit);

      // Delay by 300ms for animation to finish
      setTimeout(() => {
        this.nullIndex.row = +target.dataset.row;
        this.nullIndex.col = +target.dataset.col;
        this.isGridSorted = this.checkGridSort();

        this.setState({
          grid: newState,
        });
        target.classList.remove("move-" + gridDirection);

        // Make the undo object mutable as the user click should allow updating the stack
        this.undoObject.mutable = true;
      }, 300);
    }
  };

  checkGridSort = () => {
    for (let i = 0; i < this.gridSize.row; i++)
      for (let j = 0; j < this.gridSize.col; j++)
        if (
          (this.state.grid[i][j] && this.state.grid[i][j] === i * this.gridSize.row + j + 1) ||
          (!this.state.grid[i][j] && i === this.gridSize.row - 1 && j === this.gridSize.col - 1)
        )
          continue;
        else return false;

    return true;
  };

  updateUndoObject(digit) {
    // If check makes sure undo button click multi click safe (Debounce can also be used instead)
    if (this.undoObject.mutable) {
      this.moveCounter++;
      this.undoObject.stack.push(digit);
      if (this.undoObject.stack.length > this.undoObject.capacity) this.undoObject.stack.shift();
    }
  }

  getStateAndDirectionOnBoxMove = (state, row, col, digit) => {
    let newState;
    let gridDirection = false;

    // Only move the clicked box if it is to left, right, top or bottom of the empty box
    if (row > 0 && state.grid[row - 1][col] === digit) {
      newState = createNewState(state);
      newState[row - 1][col] = null;
      gridDirection = "down";
    } else if (row < 3 && state.grid[row + 1][col] === digit) {
      newState = createNewState(state);
      newState[row + 1][col] = null;
      gridDirection = "up";
    } else if (col > 0 && state.grid[row][col - 1] === digit) {
      newState = createNewState(state);
      newState[row][col - 1] = null;
      gridDirection = "right";
    } else if (col < 3 && state.grid[row][col + 1] === digit) {
      newState = createNewState(state);
      newState[row][col + 1] = null;
      gridDirection = "left";
    }

    if (gridDirection) newState[row][col] = digit;
    return { newState, gridDirection };

    function createNewState(state) {
      return [...state.grid];
    }
  };

  performUndo = () => {
    if (this.undoObject.mutable) {
      // Make the undoObject stack immutable as the click will not be triggered by user
      this.undoObject.mutable = false;
      this.moveCounter--;
      document.querySelector(`[data-digit='${this.undoObject.stack.pop()}']`).click();
    }
  };

  render() {
    return (
      <div>
        <div className="grid" onClick={this.onBoxClickHandler}>
          {this.state.grid.map((row, rowIndex) =>
            row.map((digit, colIndex) => (
              <div key={digit} data-digit={digit} data-row={rowIndex} data-col={colIndex} className={digit ? "" : "empty"}>
                {digit}
              </div>
            ))
          )}
        </div>
        <div className="menu">
          <button className="button" onClick={this.onResetClickHandler}>
            Reset
          </button>
          {this.undoObject.stack.length === 0 ? (
            <button className="button" disabled>
              Undo
            </button>
          ) : (
            <button className="button" onClick={this.performUndo}>
              Undo
            </button>
          )}
        </div>
        <h3>Total moves: {this.moveCounter}</h3>
        {this.isGridSorted ? <h2>hurray. You did it !!!!!!!</h2> : ""}
      </div>
    );
  }
}
