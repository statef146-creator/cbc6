import FlipCardForm from '@/components/ui/FlipCardForm'
import { motion } from 'framer-motion'
import { getCloudinaryUrl } from '@/lib/cloudinary'

export default function Register() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
  
  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="w-full max-w-md" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
        <div className="text-center mb-8">
          <motion.div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mb-4 shadow-lg" whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }}>
            <img 
              src={getCloudinaryUrl('logo', { w: 60, h: 60, c: 'pad', b: 'rgb:ffffff' })} 
              alt="Brighter Minds CBC Logo" 
              className="w-full h-full rounded-xl object-contain"
              onError={(e) => { 
                const target = e.target as HTMLImageElement
                target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230284c7"/><text x="50" y="60" font-size="40" fill="white" text-anchor="middle">BM</text></svg>`
              }}
            />
          </motion.div>
          <motion.h1 className="text-3xl font-bold text-primary-800" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>Create Your Account</motion.h1>
          <motion.p className="text-slate-600 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Join Kenya's Leading CBC Learning Platform</motion.p>
        </div>
        <FlipCardForm initialMode="register" />
        <motion.div className="text-center mt-8 text-sm text-slate-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <p>© {new Date().getFullYear()} Brighter Minds CBC • Aligned with KICD Standards</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="/privacy" className="hover:text-primary-600 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary-600 transition-colors">Terms</a>
            <a href="/kicd" className="hover:text-primary-600 transition-colors">KICD Compliance</a>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}