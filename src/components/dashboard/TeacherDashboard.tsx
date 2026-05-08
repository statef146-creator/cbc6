import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { cbcGrades, getSubjectsForGrade, calculateCBCGrade } from '@/lib/cbc-curriculum'
import SearchInput from '@/components/ui/SearchInput'
import TeacherAI from './TeacherAI'
import GradeCalculator from './GradeCalculator'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/lib/animations'

const mockStudents = [
  { id: '1', name: 'Brian Otieno', grade: '7', avatar: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_80,h_80,c_thumb/students/brian.jpg`, subjects: { Mathematics: 85, English: 78, Science: 92 } },
  { id: '2', name: 'Amina Mohamed', grade: '7', avatar: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_80,h_80,c_thumb/students/amina.jpg`, subjects: { Mathematics: 95, English: 88, Science: 85 } },
  { id: '3', name: 'John Kamau', grade: '7', avatar: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_80,h_80,c_thumb/students/john.jpg`, subjects: { Mathematics: 72, English: 81, Science: 79 } },
]

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const [selectedGrade, setSelectedGrade] = useState('grade-7')
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'notes' | 'students' | 'analytics'>('notes')

  const availableSubjects = getSubjectsForGrade(selectedGrade as any)
  
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade === selectedGrade.replace('grade-', '')
  )

  return (
    <motion.div className="min-h-screen bg-slate-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">👩‍🏫 Teacher Dashboard</h1>
            <p className="text-primary-100">Welcome back, <strong>{user?.name}</strong></p>
            {user?.school && <p className="text-primary-200 text-sm">🏫 {user.school}</p>}
          </div>
          <motion.button onClick={logout} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Logout</motion.button>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Quick Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
          {[
            { label: 'Total Students', value: '42', icon: '👥', color: 'text-primary-600' },
            { label: 'Classes', value: '3', icon: '📚', color: 'text-secondary-600' },
            { label: 'Lessons Created', value: '28', icon: '📝', color: 'text-accent-orange' },
            { label: 'Avg. Performance', value: '78%', icon: '📊', color: 'text-accent-purple' },
          ].map((stat, i) => (
            <motion.div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-primary-100" variants={fadeIn} transition={{ delay: i * 0.1 }}>
              <div className={`text-2xl mb-1 ${stat.color}`}>{stat.icon}</div>
              <div className="text-2xl font-bold text-primary-700">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          {(['notes', 'students', 'analytics'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize rounded-t-lg transition-colors ${
                activeTab === tab 
                  ? 'bg-primary-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'notes' ? '📝 AI Notes' : tab === 'students' ? '👥 Students' : '📈 Analytics'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'notes' && (
          <motion.div className="grid md:grid-cols-2 gap-6" variants={staggerContainer} initial="hidden" animate="visible">
            {/* AI Notes Generator */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
              <h2 className="text-xl font-bold text-primary-700 mb-4">✨ AI Lesson Notes Generator</h2>
              <TeacherAI 
                grade={selectedGrade}
                subject={selectedSubject}
                onGenerate={(content) => console.log('Generated:', content)}
              />
            </div>

            {/* Grade & Subject Selector */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
              <h3 className="font-semibold text-primary-700 mb-4">Select Curriculum</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                  <select 
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    {cbcGrades.map(grade => (
                      <option key={grade.id} value={grade.id}>{grade.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    {availableSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-medium text-primary-800 mb-2">CBC Competencies for {selectedSubject}</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>✓ Critical thinking & problem solving</li>
                    <li>✓ Communication & collaboration</li>
                    <li>✓ Digital literacy integration</li>
                    <li>✓ Kenyan context examples</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'students' && (
          <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100" variants={fadeIn}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-primary-700">👥 Student Management</h2>
              <div className="w-full md:w-72">
                <SearchInput 
                  placeholder="Search students by name..." 
                  onSearch={setSearchQuery}
                />
              </div>
            </div>

            {/* Student Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Student</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Grade</th>
                    {Object.keys(mockStudents[0]?.subjects || {}).map(sub => (
                      <th key={sub} className="text-left py-3 px-4 font-semibold text-slate-700">{sub}</th>
                    ))}
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%230ea5e9" width="100" height="100"/><text x="50" y="60" font-size="40" fill="white" text-anchor="middle">${student.name.charAt(0)}</text></svg>` }} />
                        <span className="font-medium">{student.name}</span>
                      </td>
                      <td className="py-3 px-4">Grade {student.grade}</td>
                      {Object.entries(student.subjects).map(([subject, mark]: [string, any]) => (
                        <td key={subject} className="py-3 px-4">
                          <input 
                            type="number" 
                            defaultValue={mark}
                            className="w-16 p-1 border border-slate-300 rounded text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                        </td>
                      ))}
                      <td className="py-3 px-4">
                        <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">Edit ✓</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grade Calculator */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <GradeCalculator />
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div className="grid md:grid-cols-2 gap-6" variants={staggerContainer} initial="hidden" animate="visible">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
              <h3 className="font-bold text-primary-700 mb-4">📊 Class Performance</h3>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-slate-500">📈 Chart component would render here (using Recharts)</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
              <h3 className="font-bold text-primary-700 mb-4">🎯 Learning Paths</h3>
              <div className="space-y-4">
                {['Critical Thinking', 'Digital Literacy', 'Collaboration'].map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill}</span>
                      <span className="font-medium">{70 + i * 10}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        style={{ width: `${70 + i * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}