import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiService, CBC_PROMPTS } from '@/lib/groq'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface StudentTutorProps {
  grade: string
  subjects: string[]
}

export default function StudentTutor({ grade, subjects }: StudentTutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Jambo! 👋 I'm your AI tutor. I can help you with:\n\n${subjects.map(s => `• ${s}`).join('\n')}\n\nWhat would you like to learn today? 🌟`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const prompt = CBC_PROMPTS.tutor(grade, subjects[0], userMessage.content)
      const response = await aiService.generate(prompt)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Tutor error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again! 🙏',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions = [
    'Explain fractions simply',
    'How do I write a good essay?',
    'What is photosynthesis?',
    'Help me with this math problem'
  ]

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 mb-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                message.role === 'user' 
                  ? 'user-message ml-auto' 
                  : 'ai-message'
              }`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">
                    {message.role === 'user' ? '👤' : '🤖'}
                  </span>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
                <div className="text-xs opacity-70 mt-2 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="ai-message p-4 rounded-2xl flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              <span>Thinking...</span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickQuestions.map((q, i) => (
            <motion.button
              key={i}
              onClick={() => setInput(q)}
              className="px-3 py-1.5 bg-primary-100 hover:bg-primary-200 text-primary-800 rounded-full text-sm whitespace-nowrap transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {q}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything about your subjects..."
            className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none"
            disabled={loading}
          />
          <motion.button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-3 bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 text-white rounded-xl transition-colors disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            <Send size={20} />
          </motion.button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          💡 Tip: Ask specific questions for better answers!
        </p>
      </div>
    </div>
  )
}