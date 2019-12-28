import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: line };
    }
  }
  return null;
}

function Square(props) {
  let className = "square";
  console.log("hi: " + JSON.stringify(props));
  if (props.hilight) {
    className += " hilight";
  }
  return (
    <button className={className} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        hilight={this.props.hilights.includes(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const loop = [0, 1, 2];

    const content = loop.map(row => {
      const colContent = loop.map(col => {
        return this.renderSquare(row * 3 + col);
      });
      return <div className="board-row">{colContent}</div>;
    });

    return <div>{content}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true
    };
  }
  handleCheck(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  toggleSortOrder() {}

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  toAxis(index) {
    let x = (index % 3) + 1;
    let y = Math.floor(index / 3) + 1;
    return [x, y];
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      let className = "";
      let desc = "";
      if (move) {
        let diff = null;
        for (let i = 0; i < 9; i++) {
          if (history[move].squares[i] !== history[move - 1].squares[i]) {
            diff = i;
            break;
          }
        }
        let axis = this.toAxis(diff);
        desc =
          "Go to move #" + move + " (row:" + axis[1] + ", col:" + axis[0] + ")";
      } else {
        desc = "Go to game start";
      }
      if (this.state.stepNumber === move) {
        className = "active";
      }
      return (
        <li key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    if (!this.state.isDescending) {
      moves = moves.reverse();
    }

    let sort = (
      <button
        onClick={() =>
          this.setState({ isDescending: !this.state.isDescending })
        }
      >
        {this.state.isDescending ? "Descending ↑" : "Ascending ↓"}
      </button>
    );

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      if (current.squares.includes(null)) {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      } else {
        status = "Draw...";
      }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            hilights={winner ? winner.line : []}
            onClick={i => this.handleCheck(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{sort}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
