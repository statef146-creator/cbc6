import { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

interface SearchInputProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export default function SearchInput({ 
  placeholder = "What do you want to search?", 
  onSearch, 
  className 
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <StyledWrapper className={className}>
      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <motion.div 
          className="input__container"
          animate={{ 
            transform: isFocused ? 'rotateX(0) rotateY(0)' : 'rotateX(10deg) rotateY(-15deg)',
            boxShadow: isFocused ? '0 10px 40px rgba(2,132,199,0.3)' : 'none'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="shadow__input" />
          <motion.button 
            type="submit" 
            className="input__button__shadow" 
            aria-label="Search"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={20} className="text-primary-600" />
          </motion.button>
          <motion.input 
            type="text" 
            name="search" 
            className="input__search" 
            placeholder={placeholder} 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </motion.div>
      </motion.form>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .input__container { 
    position: relative; 
    background: rgba(255,255,255,0.9); 
    padding: 8px 12px; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    gap: 8px; 
    border-radius: 24px; 
    max-width: 320px; 
    transform-style: preserve-3d; 
    perspective: 600px; 
    border: 2px solid rgba(2,132,199,0.3); 
  }
  .shadow__input { 
    content: ""; 
    position: absolute; 
    width: 100%; 
    height: 100%; 
    left: 0; 
    bottom: 0; 
    z-index: -1; 
    filter: blur(35px); 
    border-radius: 22px; 
    background: linear-gradient(135deg, rgba(14,165,233,0.3), rgba(34,197,94,0.3)); 
    opacity: 0.8; 
  }
  .input__button__shadow { 
    cursor: pointer; 
    border: none; 
    background: none; 
    transition: transform 200ms, background 200ms; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    border-radius: 14px; 
    padding: 6px; 
  }
  .input__button__shadow:hover { 
    background: rgba(2,132,199,0.1); 
  }
  .input__search { 
    width: 100%; 
    border-radius: 20px; 
    outline: none; 
    border: none; 
    padding: 10px 12px; 
    font-size: 0.95rem; 
    color: #1e293b; 
    background: transparent; 
  }
  .input__search::placeholder { 
    color: #64748b; 
  }
  .input__search:focus { 
    background: rgba(248,250,252,0.8); 
  }
  @media (max-width: 640px) { 
    .input__container { 
      max-width: 100%; 
      transform: none; 
    } 
  }
`