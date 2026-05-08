import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { calculateCBCGrade } from '@/lib/cbc-curriculum'
import SearchInput from '@/components/ui/SearchInput'
import ParentFeedback from './ParentFeedback'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/lib/animations'

const mockChildren = [
  {
    id: 'child-1',
    name: 'Brian Otieno',
    grade: '7',
    school: 'Nairobi Primary School',
    avatar: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_80,h_80,c_thumb/students/brian.jpg`,
    subjects: [
      { name: 'Mathematics', mark: 85, comments: 'Excellent problem solving' },
      { name: 'English', mark: 78, comments: 'Good progress in writing' },
      { name: 'Science', mark: 92, comments: 'Outstanding curiosity!' },
    ],
    attendance: 96,
    teacherNotes: 'Brian is a bright student who participates actively in class discussions.'
  }
]

export default function ParentDashboard() {
  const { user, logout } = useAuth()
  const [selectedChild, setSelectedChild] = useState(mockChildren[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'reports'>('overview')

  const filteredChildren = mockChildren.filter(child =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div className="min-h-screen bg-slate-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">👨‍👩‍👧 Parent Dashboard</h1>
            <p className="text-primary-100">Welcome back, <strong>{user?.name}</strong></p>
          </div>
          <motion.button onClick={logout} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Logout</motion.button>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Child Selector */}
        <motion.div className="bg-white rounded-xl shadow-sm p-4 border border-primary-100" variants={fadeIn}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="font-bold text-primary-700">👤 My Children</h2>
            <div className="w-full md:w-72">
              <SearchInput 
                placeholder="Search by name..." 
                onSearch={setSearchQuery}
              />
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filteredChildren.map(child => (
              <motion.button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors whitespace-nowrap flex items-center gap-3 ${
                  selectedChild?.id === child.id
                    ? 'border-primary-500 bg-primary-50 text-primary-800'
                    : 'border-slate-200 hover:border-primary-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src={child.avatar} alt={child.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%230ea5e9" width="100" height="100"/><text x="50" y="60" font-size="40" fill="white" text-anchor="middle">${child.name.charAt(0)}</text></svg>` }} />
                <div className="text-left">
                  <div className="font-medium">{child.name}</div>
                  <div className="text-xs text-slate-500">Grade {child.grade}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {selectedChild && (
          <>
            {/* Quick Overview */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
              {[
                { label: 'Overall Grade', value: 'B+', icon: '🏆', color: 'text-green-600' },
                { label: 'Attendance', value: `${selectedChild.attendance}%`, icon: '✅', color: 'text-primary-600' },
                { label: 'Subjects', value: selectedChild.subjects.length.toString(), icon: '📚', color: 'text-secondary-600' },
                { label: 'Teacher Messages', value: '2', icon: '💬', color: 'text-accent-orange' },
              ].map((stat, i) => (
                <motion.div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100" variants={fadeIn} transition={{ delay: i * 0.1 }}>
                  <div className={`text-2xl mb-1 ${stat.color}`}>{stat.icon}</div>
                  <div className="text-xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
              {(['overview', 'feedback', 'reports'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium capitalize rounded-t-lg transition-colors ${
                    activeTab === tab 
                      ? 'bg-primary-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'overview' ? '📊 Overview' : tab === 'feedback' ? '💬 Feedback' : '📄 Reports'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <motion.div className="grid md:grid-cols-2 gap-6" variants={staggerContainer} initial="hidden" animate="visible">
                {/* Subject Performance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
                  <h3 className="font-bold text-primary-700 mb-4">📚 Subject Performance</h3>
                  <div className="space-y-4">
                    {selectedChild.subjects.map(subject => {
                      const grade = calculateCBCGrade(subject.mark, 100)
                      return (
                        <motion.div key={subject.name} className="p-4 bg-slate-50 rounded-lg" variants={fadeIn}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{subject.name}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${grade.color}`}>
                              {grade.code}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Score: {subject.mark}/100</span>
                            <span className="text-primary-600">{subject.comments}</span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Teacher Notes */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
                  <h3 className="font-bold text-primary-700 mb-4">👩‍🏫 Teacher's Notes</h3>
                  <div className="p-4 bg-primary-50 rounded-lg border-l-4 border-primary-400">
                    <p className="text-slate-700 italic">"{selectedChild.teacherNotes}"</p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-medium text-secondary-800 mb-2">🎯 Areas to Support at Home</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Practice math word problems using shopping examples</li>
                      <li>• Read together for 20 minutes daily</li>
                      <li>• Encourage science experiments with household items</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'feedback' && (
              <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100" variants={fadeIn}>
                <ParentFeedback 
                  childName={selectedChild.name}
                  teacherName="Ms. Jane Mwangi"
                  onSubmit={(feedback) => {
                    console.log('Feedback submitted:', feedback)
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100" variants={fadeIn}>
                <h3 className="font-bold text-primary-700 mb-4">📄 Term Reports</h3>
                <div className="space-y-3">
                  {['Term 3, 2024', 'Term 2, 2024', 'Term 1, 2024'].map((term, i) => (
                    <motion.button 
                      key={term}
                      className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-primary-50 rounded-lg border border-slate-200 transition-colors text-left"
                      variants={fadeIn}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div>
                        <div className="font-medium">{term}</div>
                        <div className="text-sm text-slate-500">Report Card • PDF</div>
                      </div>
                      <span className="text-primary-600 font-medium">Download ↓</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </motion.div>
  )
}