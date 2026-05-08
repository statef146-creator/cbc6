import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, BookOpen, Users, FileText, BarChart3, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight, Home, MessageSquare, Calendar, Award, Gamepad2, Bell, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCloudinaryUrl } from '@/lib/cloudinary'

interface SidebarProps {
  role?: 'teacher' | 'student' | 'parent'
}

export default function Sidebar({ role }: SidebarProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
  const userRole = role || user?.role || 'student'

  const navItems = {
    teacher: [
      { href: '/dashboard/teacher', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/teacher/lessons', label: 'My Lessons', icon: BookOpen },
      { href: '/dashboard/teacher/students', label: 'Students', icon: Users },
      { href: '/dashboard/teacher/notes', label: 'AI Notes', icon: FileText },
      { href: '/dashboard/teacher/quizzes', label: 'Quizzes', icon: Award },
      { href: '/dashboard/teacher/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/dashboard/teacher/messages', label: 'Messages', icon: MessageSquare },
      { href: '/dashboard/teacher/calendar', label: 'Calendar', icon: Calendar },
    ],
    student: [
      { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/student/courses', label: 'My Courses', icon: BookOpen },
      { href: '/dashboard/student/tutor', label: 'AI Tutor', icon: MessageSquare },
      { href: '/dashboard/student/progress', label: 'Progress', icon: BarChart3 },
      { href: '/dashboard/student/quizzes', label: 'Quizzes', icon: Award },
      { href: '/dashboard/student/chess', label: 'Chess Practice', icon: Gamepad2 },
      { href: '/dashboard/student/achievements', label: 'Achievements', icon: Award },
      { href: '/dashboard/student/calendar', label: 'Schedule', icon: Calendar },
    ],
    parent: [
      { href: '/dashboard/parent', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/parent/children', label: 'My Children', icon: Users },
      { href: '/dashboard/parent/reports', label: 'Reports', icon: FileText },
      { href: '/dashboard/parent/progress', label: 'Progress', icon: BarChart3 },
      { href: '/dashboard/parent/feedback', label: 'Feedback', icon: MessageSquare },
      { href: '/dashboard/parent/meetings', label: 'Meetings', icon: Calendar },
      { href: '/dashboard/parent/payments', label: 'Payments', icon: BarChart3 },
    ],
  }

  const bottomNavItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/help', label: 'Help Center', icon: HelpCircle },
    { href: '/', label: 'Back to Home', icon: Home },
  ]

  const currentNavItems = navItems[userRole as keyof typeof navItems] || navItems.student

  const handleLogout = () => logout()

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button 
        onClick={() => setIsMobileOpen(true)} 
        className="fixed top-4 left-4 z-40 md:hidden p-2 bg-primary-600 text-white rounded-lg shadow-lg" 
        aria-label="Open menu"
        whileTap={{ scale: 0.9 }}
      >
        <Menu size={24} />
      </motion.button>
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsMobileOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-primary-900 to-primary-800 text-white transition-all duration-300 z-50 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`} 
        initial={{ x: -300 }} 
        animate={{ x: 0 }} 
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <Link to="/" className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <img 
                      src={getCloudinaryUrl('logo', { w: 40, h: 40, c: 'pad', b: 'rgb:ffffff' })} 
                      alt="Brighter Minds CBC Logo" 
                      className="w-10 h-10 rounded-lg object-contain" 
                      onError={(e) => { 
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement?.classList.add('logo-fallback')
                      }} 
                    />
                    <div className="logo-fallback-text text-white text-lg font-bold hidden">BM</div>
                  </motion.div>
                  <motion.span className="font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Brighter Minds</motion.span>
                </Link>
              )}
              <motion.button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden md:flex" 
                title={isCollapsed ? 'Expand' : 'Collapse'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </motion.button>
              <motion.button 
                onClick={() => setIsMobileOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden" 
                aria-label="Close menu"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
            </div>
          </div>

          {/* User Profile */}
          <motion.div className="p-4 border-b border-white/10" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} initial="hidden" animate="visible">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <img 
                  src={user?.avatar || getCloudinaryUrl('avatars/default', { w: 50, h: 50, c: 'thumb' })} 
                  alt={user?.name || 'User'} 
                  className="w-12 h-12 rounded-full border-2 border-white/30 object-cover" 
                  onError={(e) => { 
                    const target = e.target as HTMLImageElement
                    target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%230ea5e9' width='100' height='100'/><text x='50' y='60' font-size='40' fill='white' text-anchor='middle'>${user?.name?.charAt(0) || 'U'}</text></svg>`
                  }} 
                />
              </motion.div>
              {!isCollapsed && (
                <motion.div className="flex-1 min-w-0" variants={{ hidden: { x: -10, opacity: 0 }, visible: { x: 0, opacity: 1 } }} initial="hidden" animate="visible">
                  <p className="font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-primary-200 capitalize">{user?.role}</p>
                  {user?.school && <p className="text-xs text-primary-300 truncate">{user.school}</p>}
                  {user?.grade && <p className="text-xs text-primary-300">Grade {user.grade}</p>}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {!isCollapsed && <motion.div className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Main Menu</motion.div>}
            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
              {currentNavItems.map((item, i) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                return (
                  <motion.div key={item.href} variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }} transition={{ delay: i * 0.05 }}>
                    <Link 
                      to={item.href} 
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                        isActive ? 'bg-white/20 text-white font-medium' : 'text-primary-200 hover:bg-white/10 hover:text-white'
                      }`} 
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && <motion.span className="truncate" whileHover={{ x: 3 }}>{item.label}</motion.span>}
                      {isActive && !isCollapsed && <motion.div className="ml-auto w-1.5 h-1.5 bg-primary-400 rounded-full" layoutId="activeIndicator" />}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            {!isCollapsed && (
              <>
                <motion.div className="text-xs font-semibold text-primary-300 uppercase tracking-wider mt-6 mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Support</motion.div>
                <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
                  {bottomNavItems.map((item, i) => (
                    <motion.div key={item.href} variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }} transition={{ delay: 0.4 + i * 0.05 }}>
                      <Link 
                        to={item.href} 
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                          location.pathname === item.href ? 'bg-white/20 text-white font-medium' : 'text-primary-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <item.icon size={20} className="flex-shrink-0" />
                        <motion.span className="truncate" whileHover={{ x: 3 }}>{item.label}</motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </nav>

          {/* Footer */}
          <motion.div className="p-4 border-t border-white/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <motion.button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-3 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors" 
              title={isCollapsed ? 'Logout' : undefined}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {!isCollapsed && <motion.span whileHover={{ x: 3 }}>Logout</motion.span>}
            </motion.button>
            {!isCollapsed && (
              <motion.div className="mt-4 text-center" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} initial="hidden" animate="visible">
                <p className="text-xs text-primary-300">v1.0.0</p>
                <p className="text-xs text-primary-400">Made with ❤️ in Kenya</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Expand Button (Collapsed State) */}
        {isCollapsed && (
          <motion.button 
            onClick={() => setIsCollapsed(false)} 
            className="absolute right-0 top-20 w-8 h-8 bg-primary-700 hover:bg-primary-600 rounded-r-lg flex items-center justify-center text-white shadow-lg" 
            title="Expand sidebar"
            whileHover={{ x: 3 }}
          >
            <ChevronRight size={16} />
          </motion.button>
        )}
      </motion.aside>

      {/* Notification Badge */}
      <motion.div className="fixed right-4 top-4 z-30 hidden md:flex" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-colors">
          <Bell size={16} />
          <motion.span className="text-xs font-bold bg-red-500 px-2 py-0.5 rounded-full" variants={{ pulse: { scale: [1, 1.1, 1] } }} animate="pulse" transition={{ duration: 1.5, repeat: Infinity }}>3</motion.span>
        </button>
      </motion.div>
    </>
  )
}