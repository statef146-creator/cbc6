import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface FlipCardFormProps {
  initialMode?: 'login' | 'register'
}

export default function FlipCardForm({ initialMode = 'login' }: FlipCardFormProps) {
  const [isFlipped, setIsFlipped] = useState(initialMode === 'register')
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'student' as const })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent, mode: 'login' | 'register') => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const result = mode === 'login' 
        ? await login(formData.email, formData.password)
        : await register({ ...formData, password: formData.password })
      if (!result.success) setError(result.error || 'Failed')
    } catch {
      setError('Error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledWrapper>
      <motion.div className="wrapper" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="card-switch">
          <label className="switch">
            <input type="checkbox" className="toggle" checked={isFlipped} onChange={(e) => setIsFlipped(e.target.checked)} />
            <span className="slider" />
            <span className="card-side" />
            <AnimatePresence mode="wait">
              <motion.div 
                key={isFlipped ? 'back' : 'front'}
                className="flip-card__inner"
                initial={{ rotateY: isFlipped ? 180 : 0 }}
                animate={{ rotateY: isFlipped ? 0 : 180 }}
                exit={{ rotateY: isFlipped ? 0 : 180 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {/* FRONT - LOGIN */}
                <motion.div className="flip-card__front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <motion.div className="title" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>Log in</motion.div>
                  <form className="flip-card__form" onSubmit={(e) => handleSubmit(e, 'login')}>
                    <motion.input className="flip-card__input" name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} />
                    <motion.input className="flip-card__input" name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} required initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} />
                    <AnimatePresence>
                      {error && <motion.div className="error-message" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.div>}
                    </AnimatePresence>
                    <motion.button className="flip-card__btn" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{loading ? 'Loading...' : "Let's go!"}</motion.button>
                  </form>
                  <motion.div className="demo-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>Demo: teacher@gmail.com / teacher123</motion.div>
                </motion.div>
                
                {/* BACK - REGISTER */}
                <motion.div className="flip-card__back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <motion.div className="title" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>Sign up</motion.div>
                  <form className="flip-card__form" onSubmit={(e) => handleSubmit(e, 'register')}>
                    <motion.input className="flip-card__input" name="name" placeholder="Full Name" type="text" value={formData.name} onChange={handleChange} required initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} />
                    <motion.input className="flip-card__input" name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} />
                    <motion.input className="flip-card__input" name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} required initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} />
                    <motion.select className="flip-card__input" name="role" value={formData.role} onChange={handleChange} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                      <option value="student">🎓 Student</option>
                      <option value="teacher">👩‍🏫 Teacher</option>
                      <option value="parent">👨‍👩‍👧‍👦 Parent</option>
                    </motion.select>
                    <AnimatePresence>
                      {error && <motion.div className="error-message" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.div>}
                    </AnimatePresence>
                    <motion.button className="flip-card__btn" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{loading ? 'Creating...' : 'Confirm!'}</motion.button>
                  </form>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </label>
        </div>
      </motion.div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .wrapper { --input-focus: #0ea5e9; --font-color: #1e293b; --font-color-sub: #64748b; --bg-color: #fff; --main-color: #0284c7; display: flex; flex-direction: column; align-items: center; padding: 2rem; }
  .card-switch { position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 30px; width: 50px; height: 20px; margin-bottom: 1rem; }
  .card-side::before { position: absolute; content: 'Log in'; left: -70px; top: 0; width: 100px; text-decoration: underline; color: var(--font-color); font-weight: 600; font-size: 0.9rem; }
  .card-side::after { position: absolute; content: 'Sign up'; left: 70px; top: 0; width: 100px; text-decoration: none; color: var(--font-color); font-weight: 600; font-size: 0.9rem; }
  .toggle { opacity: 0; width: 0; height: 0; }
  .slider { box-sizing: border-box; border-radius: 5px; border: 2px solid var(--main-color); box-shadow: 4px 4px var(--main-color); position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--bg-color); transition: 0.3s; }
  .slider:before { box-sizing: border-box; position: absolute; content: ""; height: 20px; width: 20px; border: 2px solid var(--main-color); border-radius: 5px; left: -2px; bottom: 2px; background-color: var(--bg-color); box-shadow: 0 3px 0 var(--main-color); transition: 0.3s; }
  .toggle:checked + .slider { background-color: var(--input-focus); }
  .toggle:checked + .slider:before { transform: translateX(30px); }
  .toggle:checked ~ .card-side:before { text-decoration: none; }
  .toggle:checked ~ .card-side:after { text-decoration: underline; }
  .flip-card__inner { width: 320px; height: 420px; position: relative; background-color: transparent; perspective: 1000px; text-align: center; transform-style: preserve-3d; }
  .flip-card__front, .flip-card__back { padding: 24px; position: absolute; display: flex; flex-direction: column; justify-content: center; -webkit-backface-visibility: hidden; backface-visibility: hidden; background: white; gap: 16px; border-radius: 16px; border: 2px solid var(--main-color); box-shadow: 6px 6px 0 var(--main-color); backface-visibility: hidden; }
  .flip-card__back { width: 100%; transform: rotateY(180deg); }
  .flip-card__form { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .title { margin: 0 0 16px 0; font-size: 1.75rem; font-weight: 800; text-align: center; color: var(--main-color); }
  .flip-card__input { width: 100%; max-width: 260px; height: 44px; border-radius: 10px; border: 2px solid var(--main-color); background-color: var(--bg-color); box-shadow: 3px 3px 0 var(--main-color); font-size: 1rem; font-weight: 500; color: var(--font-color); padding: 0 16px; outline: none; transition: border-color 0.2s; }
  .flip-card__input::placeholder { color: var(--font-color-sub); opacity: 0.8; }
  .flip-card__input:focus { border: 2px solid var(--input-focus); box-shadow: 3px 3px 0 var(--input-focus); }
  .flip-card__btn { margin: 12px 0 8px 0; width: 140px; height: 44px; border-radius: 10px; border: 2px solid var(--main-color); background: linear-gradient(135deg, #0ea5e9, #0284c7); box-shadow: 4px 4px 0 #0369a1; font-size: 1.1rem; font-weight: 700; color: white; cursor: pointer; transition: all 0.2s; }
  .flip-card__btn:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #0369a1; }
  .flip-card__btn:active:not(:disabled) { transform: translate(2px, 2px); box-shadow: 0 0 0 #0369a1; }
  .flip-card__btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .error-message { background: #fef2f2; color: #dc2626; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.875rem; border: 1px solid #fecaca; width: 100%; max-width: 260px; text-align: center; }
  .demo-hint { font-size: 0.8rem; color: var(--font-color-sub); margin-top: 0.5rem; }
  @media (max-width: 400px) { .flip-card__inner { width: 280px; height: 400px; } .flip-card__input { max-width: 220px; } }
`