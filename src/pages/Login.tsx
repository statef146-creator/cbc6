import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer, slideUp, hoverLift } from '@/lib/animations'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getCloudinaryUrl } from '@/lib/cloudinary'

export default function Home() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
  
  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-primary-900 overflow-hidden">
        <img 
          src={getCloudinaryUrl('hero-banner', { w: 1600, h: 600, c: 'fill' })} 
          alt="Students learning" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          onError={(e) => { (e.target as HTMLImageElement).style.background = '#0c4a6e' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-secondary-900/80" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: 'spring' }}>
            <img 
              src={getCloudinaryUrl('logo', { w: 100, h: 100, c: 'pad', b: 'rgb:ffffff' })} 
              alt="Logo" 
              className="w-24 h-24 rounded-2xl shadow-xl mb-6"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </motion.div>
          <motion.h1 className="text-4xl md:text-5xl font-bold mb-4" variants={fadeIn} initial="hidden" animate="visible">Illuminating Kenya's Future Through CBC Education</motion.h1>
          <motion.p className="text-xl mb-8 max-w-2xl opacity-90" variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>AI-powered learning platform aligned with KICD curriculum standards</motion.p>
          <motion.div className="flex gap-4 flex-wrap justify-center" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeIn}><Link to="/register?role=teacher" className="px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-xl transition-colors">👩‍🏫 Teacher Sign Up</Link></motion.div>
            <motion.div variants={fadeIn}><Link to="/register?role=student" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">🎓 Student Sign Up</Link></motion.div>
            <motion.div variants={fadeIn}><Link to="/login" className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-colors">Login</Link></motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <AnimatedSection><h2 className="text-3xl font-bold text-center text-primary-800 mb-12">Our CBC Learning Ecosystem</h2></AnimatedSection>
        <motion.div className="grid md:grid-cols-3 gap-8" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
            { r: 'teacher', i: '👩‍🏫', t: 'For Teachers', items: ['AI lesson plans', 'Track progress', 'Upload media', 'Generate quizzes'], c: 'border-green-500' },
            { r: 'student', i: '🎓', t: 'For Students', items: ['24/7 AI tutor', 'Self-assessment', 'Kenyan themes', 'Progress tracking'], c: 'border-blue-500' },
            { r: 'parent', i: '👨‍👩‍👧‍👦', t: 'For Parents', items: ['Real-time dashboards', 'Learning paths', 'Teacher feedback', 'Weekly reports'], c: 'border-purple-500' }
          ].map((f, i) => (
            <motion.div key={i} className={`bg-white p-6 rounded-2xl shadow-md border-t-4 ${f.c} hover:shadow-lg transition-shadow`} variants={hoverLift} whileHover="hover" whileTap="tap">
              <motion.div className="text-4xl mb-4" whileHover={{ rotate: 10 }}>{f.i}</motion.div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">{f.t}</h3>
              <ul className="space-y-2 mb-6">{f.items.map((it, j) => (<motion.li key={j} className="flex items-center gap-2 text-slate-600" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: j * 0.1 }}><span className="text-green-500">✓</span>{it}</motion.li>))}</ul>
              <Link to={`/register?role=${f.r}`} className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">Register as {f.t.split(' ')[1]}</Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CBC Levels Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-primary-50">
        <div className="container mx-auto px-4">
          <AnimatedSection><h2 className="text-3xl font-bold text-center text-primary-800 mb-12">Aligned with Kenyan CBC Curriculum</h2></AnimatedSection>
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { i: '📚', t: 'Lower Primary (1-3)', d: 'Play-based: counting maize, Kenyan folktales' },
              { i: '📖', t: 'Upper Primary (4-6)', d: 'Discovery: water projects, market math' },
              { i: '🔬', t: 'Junior Secondary (7-9)', d: 'Critical thinking: local crops, entrepreneurship' },
              { i: '💡', t: 'Senior School (10+)', d: 'Career prep: Swahili coding, sustainable farming' }
            ].map((l, i) => (
              <motion.div key={i} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-secondary-500 hover:shadow-md transition-shadow" variants={slideUp} whileHover={{ y: -5 }}>
                <div className="flex items-center gap-3 mb-3"><motion.span className="text-2xl" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>{l.i}</motion.span><h3 className="font-bold text-primary-800">{l.t}</h3></div>
                <p className="text-slate-600 text-sm">{l.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-800 text-white text-center">
        <div className="container mx-auto px-4">
          <AnimatedSection><h2 className="text-3xl font-bold mb-4">Ready to Transform Education?</h2></AnimatedSection>
          <AnimatedSection delay={0.2}><p className="text-xl mb-8 opacity-90">Join thousands of Kenyan educators using Brighter Minds CBC</p></AnimatedSection>
          <motion.div className="flex gap-4 justify-center flex-wrap" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeIn}><Link to="/register" className="px-8 py-4 bg-secondary-600 hover:bg-secondary-700 text-white font-bold rounded-xl text-lg transition-colors">Get Started Free</Link></motion.div>
            <motion.div variants={fadeIn}><Link to="/login" className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-lg transition-colors">Sign In</Link></motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}