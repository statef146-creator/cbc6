import { Link, useLocation } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCloudinaryUrl } from '@/lib/cloudinary'

export default function Footer() {
  const location = useLocation()
  const currentYear = new Date().getFullYear()
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'

  const quickLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/#features', label: 'Features', icon: '⭐' },
    { href: '/#cbc', label: 'CBC Curriculum', icon: '📖' },
    { href: '/about', label: 'About Us', icon: '💡' },
    { href: '/contact', label: 'Contact', icon: '📞' },
    { href: '/blog', label: 'Blog', icon: '📝' },
  ]

  const resources = [
    { href: '/teachers', label: 'For Teachers' },
    { href: '/students', label: 'For Students' },
    { href: '/parents', label: 'For Parents' },
    { href: '/schools', label: 'For Schools' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
  ]

  const legal = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/kicd', label: 'KICD Compliance' },
    { href: '/cookies', label: 'Cookie Policy' },
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/brightermindscbc', label: 'Facebook', color: '#1877f2' },
    { icon: Twitter, href: 'https://twitter.com/brightermindscbc', label: 'Twitter', color: '#1da1f2' },
    { icon: Instagram, href: 'https://instagram.com/brightermindscbc', label: 'Instagram', color: '#e4405f' },
    { icon: Youtube, href: 'https://youtube.com/brightermindscbc', label: 'YouTube', color: '#ff0000' },
  ]

  return (
    <motion.footer className="bg-slate-900 text-slate-300 pt-16 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Column */}
          <motion.div className="space-y-4" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link to="/" className="flex items-center gap-3">
              <motion.div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center" whileHover={{ scale: 1.05 }}>
                <img 
                  src={getCloudinaryUrl('logo', { w: 50, h: 50, c: 'pad', b: 'rgb:ffffff' })} 
                  alt="Brighter Minds CBC Logo" 
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => { 
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement?.classList.add('logo-fallback')
                  }} 
                />
                <div className="logo-fallback-text text-white text-lg font-bold hidden">BM</div>
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-white">Brighter Minds CBC</h3>
                <span className="text-sm text-slate-400">Empowering Kenya's Future</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">AI-powered learning platform aligned with Kenyan CBC curriculum standards. Building tomorrow's leaders through innovative, accessible education technology.</p>
            <motion.div className="flex gap-3" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {socialLinks.map((social) => (
                <motion.a 
                  key={social.label} 
                  href={social.href} 
                  className="w-10 h-10 bg-slate-800 hover:bg-[var(--social-color)] rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={social.label} 
                  style={{ '--social-color': social.color } as React.CSSProperties}
                  whileHover={{ y: -3, scale: 1.1 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </motion.div>
            <motion.div className="flex flex-wrap gap-2" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium" whileHover={{ scale: 1.05 }}>🇰🇪 KICD Aligned</motion.span>
              <motion.span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium" whileHover={{ scale: 1.05 }}>🔒 Secure</motion.span>
              <motion.span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium" whileHover={{ scale: 1.05 }}>✅ Verified</motion.span>
            </motion.div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div className="space-y-4" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <motion.h4 className="text-lg font-semibold text-white" whileHover={{ x: 5 }}>Quick Links</motion.h4>
            <motion.ul className="space-y-2" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {quickLinks.map((link) => (
                <motion.li key={link.href} variants={{ hidden: { x: -10, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
                  <Link to={link.href} className={`flex items-center gap-2 text-sm hover:text-primary-400 transition-colors ${location.pathname === link.href ? 'text-primary-400 font-medium' : ''}`}>
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Resources Column */}
          <motion.div className="space-y-4" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <motion.h4 className="text-lg font-semibold text-white" whileHover={{ x: 5 }}>Resources</motion.h4>
            <motion.ul className="space-y-2" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {resources.map((link) => (
                <motion.li key={link.href} variants={{ hidden: { x: -10, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
                  <Link to={link.href} className="text-sm hover:text-primary-400 transition-colors">{link.label}</Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div className="space-y-4" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <motion.h4 className="text-lg font-semibold text-white" whileHover={{ x: 5 }}>Contact Us</motion.h4>
            <motion.ul className="space-y-3" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.li variants={{ hidden: { x: -10, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>Nairobi, Kenya</span>
              </motion.li>
              <motion.li variants={{ hidden: { x: -10, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="flex items-start gap-3 text-sm">
                <Mail size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@brightermindscbc.co.ke" className="hover:text-primary-400 transition-colors">support@brightermindscbc.co.ke</a>
              </motion.li>
              <motion.li variants={{ hidden: { x: -10, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="flex items-start gap-3 text-sm">
                <Phone size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+254700000000" className="hover:text-primary-400 transition-colors">+254 700 000 000</a>
              </motion.li>
              <motion.li variants={{ hidden: { x: -10, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="flex items-start gap-3 text-sm">
                <Clock size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>Mon-Fri: 8:00 AM - 5:00 PM EAT</span>
              </motion.li>
            </motion.ul>
            <motion.div className="pt-4 border-t border-slate-800" whileHover={{ scale: 1.02 }}>
              <h5 className="font-semibold text-white mb-2">📧 Subscribe to Newsletter</h5>
              <p className="text-sm text-slate-400 mb-3">Get CBC updates & teaching tips</p>
              <form className="flex gap-2">
                <input type="email" placeholder="Your email address" required className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                <motion.button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Subscribe</motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-400">&copy; {currentYear} Brighter Minds CBC. All rights reserved.</p>
            <p className="text-xs text-slate-500 mt-1">Aligned with KICD Curriculum Standards • Made with ❤️ in Kenya</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <motion.ul className="flex flex-wrap justify-center md:justify-start gap-4" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {legal.map((link) => (
                <motion.li key={link.href} variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                  <Link to={link.href} className="text-xs text-slate-400 hover:text-primary-400 transition-colors">{link.label}</Link>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div className="flex gap-2" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400" whileHover={{ scale: 1.05 }}>💳 M-Pesa Accepted</motion.span>
              <motion.span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400" whileHover={{ scale: 1.05 }}>🔐 SSL Secure</motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}