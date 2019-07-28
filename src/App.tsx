import React from 'react';
import './App.css';
import PIECES from './CONST'

interface Props{
  piece: keyof PIECES;
  owner: string;
  onClick():void;
}

interface State{
  piece:string;
  owner:string
  squares:any;
  turn: number;
}

//なぜか以下のinterfaceが必要
interface PIECES{
  'ou':string
}

class Square extends React.Component<Props> {
  render() {
    const piece: keyof PIECES = this.props.piece //変更
    const owner: string = this.props.owner
    return (
      <button className={`square ${owner}`}  onClick={this.props.onClick}>
        {PIECES[piece]['name']}
      </button>
    );
  }
}

class Board extends React.Component<any,any> {
  constructor(props:{}){
    super(props);
    this.state = {squares: this.initBoard(), turn: 0}
  }
  
  initBoard=()=>{
    const MY_SIDE='my_side';
    const ENEMY_SIDE='enemy_side';
    const squares = []
    for (let i=0;i<=100;i++){
      squares.push({'piece':'','owner':''})
    }
    for (let i=54;i<=62;i++){
      squares[i]={'piece':'fu','owner':MY_SIDE}
    }
    squares[64]={'piece':'kaku','owner':MY_SIDE}
    squares[70]={'piece':'hisya','owner':MY_SIDE}
    squares[72]=squares[80]={'piece':'kyo','owner':MY_SIDE}
    squares[73]=squares[79]={'piece':'kei','owner':MY_SIDE}
    squares[74]=squares[78]={'piece':'gin','owner':MY_SIDE}
    squares[75]=squares[77]={'piece':'kin','owner':MY_SIDE}
    squares[76]={'piece':'ou','owner':MY_SIDE}
    for (let i=18;i<=26;i++){
      squares[i]={'piece':'fu','owner':ENEMY_SIDE}
    }
    squares[16]={'piece':'kaku','owner':ENEMY_SIDE}
    squares[10]={'piece':'hisya','owner':ENEMY_SIDE}
    squares[0]=squares[8]={'piece':'kyo','owner':ENEMY_SIDE}
    squares[1]=squares[7]={'piece':'kei','owner':ENEMY_SIDE}
    squares[2]=squares[6]={'piece':'gin','owner':ENEMY_SIDE}
    squares[3]=squares[5]={'piece':'kin','owner':ENEMY_SIDE}
    squares[4]={'piece':'ou','owner':ENEMY_SIDE}
    return squares
  }
  
  handleClick=(i:number)=>{
    console.log(i)
    const squares = this.state.squares.slice();
    this.setState({squares: squares, turn: this.state.turn+1});
  }
  
  renderSquare(i:number) {
    return <Square
             piece={this.state.squares[i].piece}
             owner={this.state.squares[i].owner}
             onClick={()=>this.handleClick(i)}
             key={i} 
           />;
  }

  render() {
    const status = 'Next player: X';
    const squaress = []
    
    for (let i=0;i<9;i++){
      let rows:number[] = []
      for (let j=0;j<9;j++){
        rows.push(i*9+j)
      }
      squaress.push(rows);
    }
    
    return (
      <div>
        <div className="status">{status}</div>
        {squaress.map(c=>{
            return(
              <div className="board-row" key = {c.join()}>
                {c.map(d=>{
                  return(this.renderSquare(d))
                })}
              </div>)
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

export default Game