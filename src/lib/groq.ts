import axios from 'axios'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export const CBC_PROMPTS = {
  notes: (g: string, s: string, t: string) => `
    You are a CBC curriculum expert for Kenya. Generate lesson notes for:
    Grade: ${g}, Subject: ${s}, Topic: ${t}
    Format: 1) Learning Objectives 2) Key Concepts (Kenyan examples) 
    3) Activities 4) Assessment 5) Resources. Use simple English + Kiswahili terms.
  `,
  questions: (g: string, s: string, t: string, n: number = 5) => `
    Generate ${n} CBC assessment questions for Grade ${g}, ${s}, topic: ${t}
    Return JSON array: [{question, type: "mcq|short", options?: [], answer, explanation, competency}]
    Use Kenyan context. Mix difficulty levels.
  `,
  grade: (marks: number, total: number, level: string) => `
    CBC assessment for ${level}: Score ${marks}/${total}
    Provide: 1) Percentage 2) Grade band (EE/ME/AE/BE) 
    3) Strengths 4) Improvements 5) Recommendations. Encouraging tone for parents.
  `,
  tutor: (g: string, sub: string, q: string) => `
    Friendly AI tutor for Kenyan Grade ${g} ${sub}. Student asked: "${q}"
    Respond: 1) Simple explanation 2) Kenyan example 3) Practice question 4) Encouragement
    Keep under 150 words. Use emojis sparingly 🌟
  `,
}

export const aiService = {
  async generate(prompt: string, model = 'llama3-8b-8192') {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY
    if (!apiKey) {
      throw new DOMException('VITE_GROQ_API_KEY not set in environment variables', 'InvalidStateError')
    }

    const response = await axios.post(
      GROQ_API_URL,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data.choices[0]?.message?.content || ''
  },
  async parseJSON(text: string) {
    const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch { return null }
    }
    return null
  },
}