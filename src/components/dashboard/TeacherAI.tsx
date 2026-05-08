import { useState } from 'react'
import { Loader2, Sparkles, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { aiService, CBC_PROMPTS } from '@/lib/groq'

interface TeacherAIProps {
  grade: string
  subject: string
  onGenerate?: (content: string) => void
}

export default function TeacherAI({ grade, subject, onGenerate }: TeacherAIProps) {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    
    setLoading(true)
    setGeneratedContent('')
    
    try {
      const prompt = CBC_PROMPTS.notes(grade, subject, topic)
      const content = await aiService.generate(prompt)
      setGeneratedContent(content)
      onGenerate?.(content)
    } catch (error) {
      console.error('Generation error:', error)
      setGeneratedContent('Error generating content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Topic / Sub-strand
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Fractions, Photosynthesis, Kenyan History..."
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
      </div>

      <motion.button
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Generating with AI...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generate CBC-Aligned Notes
          </>
        )}
      </motion.button>

      {generatedContent && (
        <motion.div className="relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <motion.button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-lg shadow-sm transition-colors"
            title="Copy to clipboard"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          </motion.button>
          
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 whitespace-pre-wrap text-sm leading-relaxed">
            {generatedContent}
          </div>
          
          <div className="mt-3 flex gap-2">
            <motion.button className="px-3 py-1.5 text-sm bg-primary-100 hover:bg-primary-200 text-primary-800 rounded-lg transition-colors" whileHover={{ scale: 1.05 }}>
              📝 Edit Notes
            </motion.button>
            <motion.button className="px-3 py-1.5 text-sm bg-secondary-100 hover:bg-secondary-200 text-secondary-800 rounded-lg transition-colors" whileHover={{ scale: 1.05 }}>
              ❓ Generate Quiz
            </motion.button>
          </div>
        </motion.div>
      )}

      <motion.div className="p-3 bg-primary-50 rounded-lg text-sm text-primary-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <strong>💡 Tip:</strong> Be specific with topics for better results. 
        Example: "Introduction to fractions using maize grains" works better than just "Mathematics".
      </motion.div>
    </div>
  )
}