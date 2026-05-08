export const cbcGrades = [
  { id: 'pp1', name: 'Pre-Primary 1', level: 'early-years' as const },
  { id: 'pp2', name: 'Pre-Primary 2', level: 'early-years' as const },
  { id: 'grade-1', name: 'Grade 1', level: 'lower-primary' as const },
  { id: 'grade-2', name: 'Grade 2', level: 'lower-primary' as const },
  { id: 'grade-3', name: 'Grade 3', level: 'lower-primary' as const },
  { id: 'grade-4', name: 'Grade 4', level: 'upper-primary' as const },
  { id: 'grade-5', name: 'Grade 5', level: 'upper-primary' as const },
  { id: 'grade-6', name: 'Grade 6', level: 'upper-primary' as const },
  { id: 'grade-7', name: 'Grade 7', level: 'junior-secondary' as const },
  { id: 'grade-8', name: 'Grade 8', level: 'junior-secondary' as const },
  { id: 'grade-9', name: 'Grade 9', level: 'junior-secondary' as const },
  { id: 'grade-10', name: 'Grade 10', level: 'senior-school' as const },
  { id: 'grade-11', name: 'Grade 11', level: 'senior-school' as const },
  { id: 'grade-12', name: 'Grade 12', level: 'senior-school' as const },
] as const

export type GradeId = typeof cbcGrades[number]['id']
export type GradeLevel = typeof cbcGrades[number]['level']

export const cbcSubjects: Record<GradeLevel, string[]> = {
  'early-years': ['Literacy Activities', 'Numeracy Activities', 'Environmental Activities', 'Creative Activities', 'Psychomotor & Religious'],
  'lower-primary': ['English', 'Kiswahili', 'Mathematics', 'Environmental Activities', 'Hygiene & Nutrition', 'Creative Arts', 'Religious Education'],
  'upper-primary': ['English', 'Kiswahili', 'Mathematics', 'Science & Technology', 'Social Studies', 'Creative Arts & Sports', 'Religious Education', 'Agriculture'],
  'junior-secondary': ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Social Studies', 'Pre-Technical Studies', 'Life Skills', 'Religious Education', 'Business Studies', 'Agriculture', 'Home Science', 'Computer Studies'],
  'senior-school': ['English', 'Kiswahili', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Business Studies', 'Economics', 'Visual Arts', 'Music', 'Physical Education'],
}

export const getSubjectsForGrade = (gradeId: GradeId): string[] => {
  const grade = cbcGrades.find(g => g.id === gradeId)
  return grade ? cbcSubjects[grade.level] : []
}

export const cbcBands = {
  EE: { label: 'Exceeds Expectations', range: [90, 100] as const, color: 'grade-ee' },
  ME: { label: 'Meets Expectations', range: [70, 89] as const, color: 'grade-me' },
  AE: { label: 'Approaches Expectations', range: [50, 69] as const, color: 'grade-ae' },
  BE: { label: 'Below Expectations', range: [0, 49] as const, color: 'grade-be' },
} as const

export const calculateCBCGrade = (score: number, total: number) => {
  const pct = Math.round((score / total) * 100)
  for (const [code, band] of Object.entries(cbcBands)) {
    if (pct >= band.range[0] && pct <= band.range[1]) {
      return { code: code as keyof typeof cbcBands, label: band.label, percentage: pct, color: band.color }
    }
  }
  return { code: 'BE' as const, label: 'Below Expectations', percentage: pct, color: 'grade-be' }
}