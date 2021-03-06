import React from 'react';
import './App.css';
import {PIECES, WALL} from "./CONST.jsx"

const A_SIDE='YOU';
const B_SIDE='OPPONENT';
const STAND_BY = 'stand_by';
const PICK_UP = 'pick_up';

class Square extends React.Component {
  render() {
    const {piece,owner,toMove} = this.props
    let to_move=""
    if (toMove){to_move='to_move'}
    return (
      <button className={`square ${owner} ${to_move}`}  onClick={this.props.onClick}>
        {PIECES[piece]['name']}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squares: this.initBoard(), 
      selectedSquareNo:0
    }
  }
  
  initAll=()=>{
    const squares = this.initBoard()
    const selectedSquareNo = 0
    const {initGame} = this.props
    initGame()
    this.setState({squares:squares,selectedSquareNo:selectedSquareNo})
  }

  initBoard=()=>{
    const squares = []
    for (let i=0;i<=120;i++){
      squares.push({'piece':'','owner':'','toMove':false})
    }
    for (let i=78;i<=86;i++){
      squares[i]={'piece':'fu','owner':A_SIDE,'toMove':false}
    }
    squares[90]={'piece':'kaku','owner':A_SIDE,'toMove':false}
    squares[96]={'piece':'hisya','owner':A_SIDE,'toMove':false}
    squares[100]={'piece':'kyo','owner':A_SIDE,'toMove':false}
    squares[108]={'piece':'kyo','owner':A_SIDE,'toMove':false}
    squares[101]={'piece':'kei','owner':A_SIDE,'toMove':false}
    squares[107]={'piece':'kei','owner':A_SIDE,'toMove':false}
    squares[102]={'piece':'gin','owner':A_SIDE,'toMove':false}
    squares[106]={'piece':'gin','owner':A_SIDE,'toMove':false}
    squares[103]={'piece':'kin','owner':A_SIDE,'toMove':false}
    squares[105]={'piece':'kin','owner':A_SIDE,'toMove':false}
    squares[104]={'piece':'ou','owner':A_SIDE,'toMove':false}
    for (let i=34;i<=42;i++){
      squares[i]={'piece':'fu','owner':B_SIDE,'toMove':false}
    }
    squares[30]={'piece':'kaku','owner':B_SIDE,'toMove':false}
    squares[24]={'piece':'hisya','owner':B_SIDE,'toMove':false}
    squares[12]={'piece':'kyo','owner':B_SIDE,'toMove':false}
    squares[20]={'piece':'kyo','owner':B_SIDE,'toMove':false}
    squares[13]={'piece':'kei','owner':B_SIDE,'toMove':false}
    squares[19]={'piece':'kei','owner':B_SIDE,'toMove':false}
    squares[14]={'piece':'gin','owner':B_SIDE,'toMove':false}
    squares[18]={'piece':'gin','owner':B_SIDE,'toMove':false}
    squares[15]={'piece':'kin','owner':B_SIDE,'toMove':false}
    squares[17]={'piece':'kin','owner':B_SIDE,'toMove':false}
    squares[16]={'piece':'ou','owner':B_SIDE,'toMove':false}
    return squares
  }
  
  handleClick=(i)=>{
    const {player,phase,gameFinished,changePlayer,changePhase,judgeFinish}=this.props
    const squares = this.state.squares.slice()
    const {selectedSquareNo} = this.state
    const {piece, owner, toMove} = squares[i]
    let { pointMove, lineMove }= PIECES[piece]

    if (gameFinished){
      alert('ゲームを再開してください')
      return ''
    }

    if (player===B_SIDE){
      let {newPointMove, newLineMove} = this.convertMove(pointMove,lineMove)
      pointMove = newPointMove
      lineMove = newLineMove
    }

    this.clearAllToMove(squares)
    switch(phase){
      case STAND_BY:
        if (owner===player){
          this.getMoveList(i,pointMove,lineMove,squares,player,selectedSquareNo)
          changePhase(PICK_UP)
        }
        break
      case PICK_UP:
        if (toMove){
          const gameFinished = judgeFinish(i,squares)
          squares[i]=squares[selectedSquareNo]
          squares[selectedSquareNo]={'piece':'','owner':'','toMove':false}
          this.setState({squares:squares})
          changePhase(STAND_BY)
          if (!gameFinished){
            changePlayer()
          }
        }else if(owner===player){
          this.getMoveList(i,pointMove,lineMove,squares,player)
        }else{
          changePhase(STAND_BY)
        }
        break
      default:
        console.log('default')
    }
  }

  clearAllToMove=(squares)=>{
    squares.map(square=>{
      return square['toMove']=false
    })
    this.setState({squares:squares})
  }

  getPointMoveList=(i,pointMove,squares,player)=>{
    const pointMoveList=pointMove.filter(point=>{
      return squares[i+point]['owner']!==player
    })
    return pointMoveList.map(point=>i+point)
  }
    
  getLineMoveList=(i,lineMove,squares,player)=>{
    let opponent = ""
    player === A_SIDE ? opponent = B_SIDE : opponent = A_SIDE
    let lineMoveList=[]
    for (const dict of lineMove){
      let position=i
      let lineMoveListPart=[]
      while(WALL.indexOf(position) === -1){
        position+=dict
        if(squares[position]['owner']===player){
          break
        }else if (squares[position]['owner']===opponent){
          lineMoveListPart.push(position)
          break
        }
        lineMoveListPart.push(position)
      }
    lineMoveList=[...lineMoveList,...lineMoveListPart]
    }
    return lineMoveList
  }

  getMoveList=(i,pointMove,lineMove,squares,player)=>{
    const pointMoveList = this.getPointMoveList(i,pointMove,squares,player)
    const lineMoveList = this.getLineMoveList(i,lineMove,squares,player)
    const toMoveList = [...pointMoveList, ...lineMoveList]
    toMoveList.map(point=>{
      return squares[point]['toMove']=true
    })
    this.setState({squares:squares, selectedSquareNo:i})
  }

  convertMove=(pointMove,lineMove)=>{
    const newPointMove = pointMove.map(element=>{
      return element*=-1
    })
    const newLineMove = lineMove.map(element=>{
      return element*=-1
    })
    return {newPointMove:newPointMove, newLineMove:newLineMove}
  }

  renderSquare(i) {
    return <Square
             piece={this.state.squares[i].piece}
             owner={this.state.squares[i].owner}
             toMove={this.state.squares[i].toMove}
             onClick={()=>this.handleClick(i)}
             key={i} 
           />;
  }

  render() {
    const squaress = []
    
    for (let i=1;i<=9;i++){
      let rows= []
      for (let j=1;j<=9;j++){
        rows.push(i*11+j)
      }
      squaress.push(rows);
    }
    
    return (
      <div>
        {squaress.map(c=>{
            return(
              <div className="board-row" key = {c.join()}>
                {c.map(d=>{
                  return(this.renderSquare(d))
                })}
              </div>)
        })}
        <br/>
        <button onClick={()=>this.initAll()}>ゲーム再開</button>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      player: A_SIDE, 
      phase: STAND_BY,
      gameFinished: false}
  }

  _initGame=()=>{
    this.setState({player: A_SIDE, phase: STAND_BY, gameFinished:false})
  }

  _changePlayer=()=>{
    let {player} = this.state
    player===A_SIDE ? player=B_SIDE : player=A_SIDE
    this.setState({player:player})
  }

  _changePhase=(newPhase)=>{
    this.setState({phase:newPhase})
  }

  _judgeFinish=(i,squares)=>{
    if (squares[i]['piece']==='ou'){
      this.setState({gameFinished:true})
      return true
    }
    return false
  }

  render() {
    const{player,phase,gameFinished}=this.state
    return (
      <div className="game">
        <div className="game-board">
          <Board 
          player={player}
          phase={phase}
          gameFinished={gameFinished}
          changePlayer={this._changePlayer}
          changePhase={this._changePhase}
          initGame={this._initGame}
          judgeFinish={this._judgeFinish}
          />
        </div>
        <div className="game-info">
          <div>player : {player}</div>
          <br/>
          {gameFinished && <div>{player} の勝ちです !</div>}
        </div>
      </div>
    );
  }
}

export default Game