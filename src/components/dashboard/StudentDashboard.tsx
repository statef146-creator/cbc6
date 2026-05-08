import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { calculateCBCGrade } from '@/lib/cbc-curriculum'
import SearchInput from '@/components/ui/SearchInput'
import ChessBoard from '@/components/ui/ChessBoard'
import StudentTutor from './StudentTutor'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/lib/animations'

const studentProgress = {
  currentGrade: '7',
  subjects: [
    { name: 'Mathematics', current: 85, past: [78, 82, 80, 85], trend: 'up' as const },
    { name: 'English', current: 78, past: [75, 76, 77, 78], trend: 'up' as const },
    { name: 'Science', current: 92, past: [88, 90, 91, 92], trend: 'up' as const },
    { name: 'Kiswahili', current: 81, past: [85, 83, 80, 81], trend: 'down' as const },
  ],
  achievements: ['🌟 Math Star', '📚 Consistent Learner', '🤝 Team Player'],
}

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'tutor' | 'progress' | 'chess'>('tutor')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🎓 Student Dashboard</h1>
            <p className="text-secondary-100">Jambo, <strong>{user?.name}</strong>!</p>
            {user?.grade && <p className="text-secondary-200 text-sm">📖 Grade {user.grade}</p>}
          </div>
          <motion.button onClick={logout} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Logout</motion.button>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Welcome Card */}
        <motion.div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-secondary-500" variants={fadeIn} initial="hidden" animate="visible">
          <h2 className="text-xl font-bold text-primary-700 mb-2">🌟 Today's Learning Journey</h2>
          <p className="text-slate-600">
            You're doing great! Keep practicing your {studentProgress.subjects[0].name} 
            and try the chess challenge to boost your critical thinking. 🧠♟️
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {studentProgress.achievements.map((badge, i) => (
              <motion.span 
                key={i} 
                className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div className="flex gap-2 overflow-x-auto pb-2" variants={staggerContainer} initial="hidden" animate="visible">
          {[
            { id: 'tutor', label: '🤖 AI Tutor', icon: '🤖' },
            { id: 'progress', label: '📈 My Progress', icon: '📊' },
            { id: 'chess', label: '♟️ Chess Practice', icon: '♟️' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-primary-50 border border-slate-200'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'tutor' && (
          <motion.div className="bg-white rounded-2xl shadow-md p-6" variants={fadeIn}>
            <h2 className="text-xl font-bold text-primary-700 mb-4">💬 Ask Your AI Tutor</h2>
            <StudentTutor 
              grade={user?.grade || '7'} 
              subjects={studentProgress.subjects.map(s => s.name)}
            />
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div className="grid md:grid-cols-2 gap-6" variants={staggerContainer} initial="hidden" animate="visible">
            {/* Subject Progress */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-primary-700 mb-4">📚 Subject Performance</h3>
              <div className="space-y-4">
                {studentProgress.subjects.map(subject => {
                  const grade = calculateCBCGrade(subject.current, 100)
                  return (
                    <motion.div key={subject.name} className="p-4 bg-slate-50 rounded-xl" variants={fadeIn}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{subject.name}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${grade.color}`}>
                          {grade.code} • {grade.percentage}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all"
                            style={{ width: `${subject.current}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${
                          subject.trend === 'up' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {subject.trend === 'up' ? '↗' : '↘'}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-primary-700 mb-4">📅 Learning Timeline</h3>
              <div className="space-y-3">
                {['Week 1', 'Week 2', 'Week 3', 'This Week'].map((week, i) => (
                  <motion.div key={week} className="flex items-center gap-3" variants={fadeIn} transition={{ delay: i * 0.1 }}>
                    <div className={`w-3 h-3 rounded-full ${
                      i === 3 ? 'bg-secondary-500 animate-pulse' : 'bg-primary-300'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{week}</div>
                      <div className="text-xs text-slate-500">
                        {i === 3 ? 'Current: Focus on Science & Math' : 'Completed 3 lessons'}
                      </div>
                    </div>
                    {i < 3 && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        ✓ Done
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary-50 rounded-xl">
                <h4 className="font-medium text-primary-800 mb-2">🎯 This Week's Goals</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Complete fractions practice quiz</li>
                  <li>• Read 2 chapters in English reader</li>
                  <li>• Try 1 chess puzzle daily</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'chess' && (
          <motion.div className="bg-white rounded-2xl shadow-md p-6" variants={fadeIn}>
            <ChessBoard onGameEnd={(result) => {
              console.log('Chess game ended:', result)
            }} />
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}