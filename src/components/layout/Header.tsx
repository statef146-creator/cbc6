import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Menu, X, Bell, Search, User, LogOut, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCloudinaryUrl } from '@/lib/cloudinary'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileMenuOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/login') }
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`) }

  const navLinks = isAuthenticated ? [
    { href: `/${user?.role}-dashboard`, label: 'Dashboard', icon: '📊' },
    { href: '/courses', label: 'Courses', icon: '📚' },
    { href: '/resources', label: 'Resources', icon: '📁' },
    { href: '/community', label: 'Community', icon: '👥' },
  ] : [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/#features', label: 'Features', icon: '⭐' },
    { href: '/#cbc', label: 'CBC Curriculum', icon: '📖' },
    { href: '/contact', label: 'Contact', icon: '📞' },
  ]

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'

  return (
    <motion.header className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-primary-900/95 backdrop-blur-sm shadow-lg' : 'bg-primary-900'} transition-all duration-300`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border-2 border-white/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <img 
                src={getCloudinaryUrl('logo', { w: 55, h: 55, c: 'pad', b: 'rgb:1a3a6c' })} 
                alt="Brighter Minds CBC Logo" 
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => { 
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement?.classList.add('logo-fallback')
                }}
              />
              <div className="logo-fallback-text text-white text-xl font-bold hidden">BM</div>
            </motion.div>
            <div>
              <motion.h1 className="text-lg font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Brighter Minds CBC</motion.h1>
              <motion.span className="text-xs text-primary-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Illuminating Kenya's Future</motion.span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <motion.nav className="hidden md:flex items-center gap-1" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
            {navLinks.map((link, i) => (
              <motion.div key={link.href} variants={{ hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} transition={{ delay: i * 0.1 }}>
                <Link to={link.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors ${location.pathname === link.href ? 'bg-white/20 text-white font-medium' : ''}`}>
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar (Desktop) */}
            <motion.form onSubmit={handleSearch} className="hidden md:flex items-center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                <input 
                  type="text" 
                  placeholder="Search lessons, topics..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-48 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all"
                />
              </div>
            </motion.form>

            {/* Notifications */}
            <motion.button className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Notifications" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Bell size={20} />
              <motion.span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center" variants={{ pulse: { scale: [1, 1.1, 1] } }} animate="pulse" transition={{ duration: 1.5, repeat: Infinity }}>3</motion.span>
            </motion.button>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <motion.div className="hidden md:flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Link to="/login" className="px-4 py-2 text-white border-2 border-white/40 rounded-lg hover:bg-white/10 transition-colors font-medium">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-secondary-900/20">Register</Link>
              </motion.div>
            ) : (
              /* User Profile Dropdown */
              <motion.div className="relative">
                <motion.button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 pr-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors" whileHover={{ scale: 1.02 }}>
                  <img 
                    src={user?.avatar || getCloudinaryUrl('avatars/default', { w: 36, h: 36, c: 'thumb' })} 
                    alt={user?.name || 'User'} 
                    className="w-9 h-9 rounded-full border-2 border-white/40 object-cover"
                    onError={(e) => { 
                      const target = e.target as HTMLImageElement
                      target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%230ea5e9' width='100' height='100'/><text x='50' y='60' font-size='40' fill='white' text-anchor='middle'>${user?.name?.charAt(0) || 'U'}</text></svg>`
                    }}
                  />
                  <span className="text-white font-medium text-sm hidden lg:block">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={16} className="text-white/70" />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <img src={user?.avatar || getCloudinaryUrl('avatars/default', { w: 50, h: 50, c: 'thumb' })} alt={user?.name || 'User'} className="w-12 h-12 rounded-full border-2 border-primary-500 object-cover" />
                          <div>
                            <p className="font-semibold text-slate-900">{user?.name}</p>
                            <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link to={`/${user?.role}-dashboard`} className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                          <User size={18} className="text-primary-600" /> Dashboard
                        </Link>
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                          <span>⚙️</span> Settings
                        </Link>
                        <Link to="/help" className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                          <span>❓</span> Help Center
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 py-1">
                        <motion.button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors" whileHover={{ x: 5 }}>
                          <LogOut size={18} /> Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Toggle menu" whileTap={{ scale: 0.9 }}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div className="md:hidden bg-primary-900 border-t border-white/10" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all"
                />
              </form>
              
              {/* Mobile Nav Links */}
              <motion.nav className="space-y-1" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
                {navLinks.map((link) => (
                  <motion.div key={link.href} variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
                    <Link to={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors ${location.pathname === link.href ? 'bg-white/20 text-white font-medium' : ''}`}>
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
              
              {/* Mobile Auth */}
              {!isAuthenticated ? (
                <motion.div className="space-y-2 pt-2 border-t border-white/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <Link to="/login" className="block w-full px-4 py-3 text-center text-white border-2 border-white/40 rounded-xl hover:bg-white/10 transition-colors font-medium">Login</Link>
                  <Link to="/register" className="block w-full px-4 py-3 text-center bg-secondary-600 hover:bg-secondary-700 text-white rounded-xl transition-colors font-medium">Register</Link>
                </motion.div>
              ) : (
                <motion.button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-xl transition-colors font-medium" whileHover={{ scale: 1.02 }}>
                  <LogOut size={18} /> Logout
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}