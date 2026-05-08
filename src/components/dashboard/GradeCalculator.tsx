import { useState } from 'react'
import { calculateCBCGrade, cbcBands } from '@/lib/cbc-curriculum'
import { motion } from 'framer-motion'

export default function GradeCalculator() {
  const [marks, setMarks] = useState('')
  const [total, setTotal] = useState('100')
  const [result, setResult] = useState<ReturnType<typeof calculateCBCGrade> | null>(null)

  const handleCalculate = () => {
    const score = parseFloat(marks)
    const max = parseFloat(total)
    if (!isNaN(score) && !isNaN(max) && max > 0) {
      setResult(calculateCBCGrade(score, max))
    }
  }

  return (
    <div className="p-4 bg-primary-50 rounded-lg">
      <h4 className="font-semibold text-primary-800 mb-3">🧮 CBC Grade Calculator</h4>
      <div className="flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-[100px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">Marks Obtained</label>
          <input 
            type="number" 
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="e.g., 85"
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <span className="self-end text-slate-500">/</span>
        <div className="flex-1 min-w-[100px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">Total Marks</label>
          <input 
            type="number" 
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <motion.button 
          onClick={handleCalculate}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Calculate
        </motion.button>
      </div>
      
      {result && (
        <motion.div 
          className="mt-4 p-4 bg-white rounded-lg border border-slate-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-white font-bold ${result.color}`}>
              {result.code}
            </span>
            <div>
              <p className="font-medium">{result.label}</p>
              <p className="text-sm text-slate-600">{result.percentage}% score</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {Object.entries(cbcBands).map(([code, band]) => (
          <div key={code} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${band.color}`}></span>
            <span className="text-slate-600">{band.label} ({band.range[0]}-{band.range[1]}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}