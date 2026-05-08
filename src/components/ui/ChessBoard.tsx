import { useState, useCallback, useEffect } from 'react'
import { Chess, Move } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { motion, AnimatePresence } from 'framer-motion'
import { findBestMove } from '@/lib/chess-ai'

interface ChessBoardProps {
  onGameEnd?: (result: string) => void
}

export default function ChessBoard({ onGameEnd }: ChessBoardProps) {
  const [game, setGame] = useState(new Chess())
  const [gameOver, setGameOver] = useState(false)
  const [result, setResult] = useState('')
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [isAiThinking, setIsAiThinking] = useState(false)

  const makeAIMove = useCallback(() => {
    if (gameOver || game.turn() === 'w' || isAiThinking) return
    
    setIsAiThinking(true)
    
    setTimeout(() => {
      try {
        const move = findBestMove(game, 2)
        if (move) {
          const newGame = new Chess(game.fen())
          const result = newGame.move({
            from: move.from,
            to: move.to,
            promotion: 'q'
          })
          
          if (result) {
            setGame(newGame)
            setLastMove({ from: move.from, to: move.to })
            checkGameStatus(newGame)
          }
        }
      } catch (error) {
        console.error('AI move error:', error)
      } finally {
        setIsAiThinking(false)
      }
    }, 500)
  }, [game, gameOver, isAiThinking])

  const checkGameStatus = (currentGame: Chess) => {
    if (currentGame.isCheckmate()) {
      setGameOver(true)
      const winner = currentGame.turn() === 'w' ? 'Black (AI)' : 'White (You)'
      setResult(`Checkmate! ${winner} wins! 🎉`)
      onGameEnd?.(`Checkmate - ${winner}`)
    } else if (currentGame.isDraw()) {
      setGameOver(true)
      setResult('Draw! Well played! 🤝')
      onGameEnd?.('Draw')
    } else if (currentGame.isStalemate()) {
      setGameOver(true)
      setResult('Stalemate! 🎭')
      onGameEnd?.('Stalemate')
    } else if (currentGame.isInsufficientMaterial()) {
      setGameOver(true)
      setResult('Draw - Insufficient material! 🎭')
      onGameEnd?.('Draw - Insufficient material')
    }
  }

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (gameOver || game.turn() === 'b' || isAiThinking) return false
    
    try {
      const newGame = new Chess(game.fen())
      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      })
      
      if (move === null) return false
      
      setGame(newGame)
      setLastMove({ from: sourceSquare, to: targetSquare })
      checkGameStatus(newGame)
      
      if (!newGame.isGameOver() && newGame.turn() === 'b') {
        makeAIMove()
      }
      
      return true
    } catch (error) {
      console.error('Move error:', error)
      return false
    }
  }

  const resetGame = () => {
    setGame(new Chess())
    setGameOver(false)
    setResult('')
    setLastMove(null)
    setIsAiThinking(false)
  }

  const getSquareStyles = (square: string) => {
    if (lastMove && (lastMove.from === square || lastMove.to === square)) {
      return { backgroundColor: 'rgba(234, 179, 8, 0.4)' }
    }
    return {}
  }

  useEffect(() => {
    if (game.turn() === 'b' && !gameOver && !isAiThinking) {
      makeAIMove()
    }
  }, [game, gameOver, isAiThinking, makeAIMove])

  return (
    <motion.div className="chess-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-4">
        <motion.h3 className="text-lg font-bold text-primary-700" initial={{ x: -20 }} animate={{ x: 0 }}>
          ♟️ Chess Practice {isAiThinking && '🤔'}
        </motion.h3>
        <motion.button 
          onClick={resetGame} 
          className="px-3 py-1 text-sm bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </motion.button>
      </div>
      
      <motion.div className="chessboard-wrapper my-4" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop} 
          boardOrientation="white" 
          customDarkSquareStyle={{ backgroundColor: '#0369a1' }} 
          customLightSquareStyle={{ backgroundColor: '#e0f2fe' }}
          squareStyles={Object.fromEntries(['a1','h8'].map(sq => [sq, getSquareStyles(sq)]))}
          animationDuration={200}
        />
      </motion.div>
      
      <AnimatePresence>
        {gameOver && (
          <motion.div 
            className="p-3 bg-primary-50 border border-primary-200 rounded-lg text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p className="font-semibold text-primary-800" initial={{ y: -10 }} animate={{ y: 0 }}>
              {result}
            </motion.p>
            <motion.button 
              onClick={resetGame} 
              className="mt-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div className="mt-4 p-4 bg-white rounded-xl border border-primary-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h4 className="font-semibold text-primary-700 mb-2">📚 How to Play</h4>
        <motion.ul className="text-sm text-slate-600 space-y-1" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
          <motion.li variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>• You play as <strong>White</strong> (bottom), AI plays Black</motion.li>
          <motion.li variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>• Drag pieces to move - legal moves only</motion.li>
          <motion.li variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>• Try to checkmate the AI's king!</motion.li>
          <motion.li variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>• Use this to practice strategy & critical thinking 🧠</motion.li>
        </motion.ul>
        <motion.a 
          href="https://www.chess.com/learn/how-to-play-chess" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
          whileHover={{ x: 5 }}
        >
          Learn Chess Rules →
        </motion.a>
      </motion.div>
    </motion.div>
  )
}