import { Chess, Move } from 'chess.js'

const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 900 }

const evaluate = (game: Chess): number => {
  if (game.isCheckmate()) return game.turn() === 'w' ? -10000 : 10000
  if (game.isDraw() || game.isStalemate()) return 0
  
  let score = 0
  const board = game.board()
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece) {
        score += piece.color === 'w' ? pieceValues[piece.type] : -pieceValues[piece.type]
      }
    }
  }
  
  // Bonus for controlling center
  const centerSquares = ['d4', 'd5', 'e4', 'e5']
  centerSquares.forEach(square => {
    const piece = game.get(square)
    if (piece) {
      score += piece.color === 'w' ? 0.5 : -0.5
    }
  })
  
  return score
}

const minimax = (game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
  if (depth === 0 || game.isGameOver()) return evaluate(game)
  
  const moves = game.moves({ verbose: true })
  if (moves.length === 0) return evaluate(game)
  
  if (isMaximizing) {
    let best = -Infinity
    for (const move of moves) {
      const newGame = new Chess(game.fen())
      newGame.move(move)
      best = Math.max(best, minimax(newGame, depth - 1, alpha, beta, false))
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (const move of moves) {
      const newGame = new Chess(game.fen())
      newGame.move(move)
      best = Math.min(best, minimax(newGame, depth - 1, alpha, beta, true))
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

export const findBestMove = (game: Chess, depth = 2): Move | null => {
  const moves = game.moves({ verbose: true })
  if (moves.length === 0) return null
  
  let bestMove: Move | null = moves[0]
  let bestVal = game.turn() === 'w' ? -Infinity : Infinity
  
  for (const move of moves) {
    const newGame = new Chess(game.fen())
    newGame.move(move)
    const val = minimax(newGame, depth - 1, -Infinity, Infinity, game.turn() === 'b')
    
    if (game.turn() === 'w' && val > bestVal) {
      bestVal = val
      bestMove = move
    } else if (game.turn() === 'b' && val < bestVal) {
      bestVal = val
      bestMove = move
    }
  }
  
  return bestMove
}