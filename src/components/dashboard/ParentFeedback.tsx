import { useState } from 'react'
import { Send, Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface ParentFeedbackProps {
  childName: string
  teacherName: string
  onSubmit: (feedback: { message: string; rating: number }) => void
}

export default function ParentFeedback({ childName, teacherName, onSubmit }: ParentFeedbackProps) {
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    onSubmit({ message: message.trim(), rating })
    setSubmitted(true)
    setMessage('')
    
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-primary-700 mb-2">💬 Message to {teacherName}</h3>
      <p className="text-slate-600 mb-4">About: <strong>{childName}</strong></p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            How would you rate your child's learning experience?
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                ★
              </motion.button>
            ))}
            <span className="ml-2 text-sm text-slate-500">{rating}/5</span>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share feedback, concerns, or appreciation for the teacher..."
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            required
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={submitted || !message.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          whileHover={{ scale: submitted ? 1 : 1.02 }}
          whileTap={{ scale: submitted ? 1 : 0.98 }}
        >
          {submitted ? (
            <>
              <Check size={20} />
              Sent Successfully! ✓
            </>
          ) : (
            <>
              <Send size={20} />
              Send Message
            </>
          )}
        </motion.button>
      </form>

      <motion.div 
        className="mt-4 p-3 bg-primary-50 rounded-lg text-sm text-primary-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <strong>🔒 Privacy:</strong> Your feedback is only visible to {teacherName} and school administrators.
      </motion.div>
    </div>
  )
}