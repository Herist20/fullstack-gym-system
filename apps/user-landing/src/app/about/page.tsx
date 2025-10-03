'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Users, Award } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'We focus on delivering real, measurable results for every member through proven methodologies.'
  },
  {
    icon: Heart,
    title: 'Community First',
    description: 'Building a supportive environment where everyone feels welcome and motivated to succeed.'
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description: 'Our certified trainers provide personalized support to help you reach your full potential.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Committed to maintaining the highest standards in facilities, equipment, and service.'
  },
]

const stats = [
  { number: '10+', label: 'Years Experience' },
  { number: '5000+', label: 'Active Members' },
  { number: '20+', label: 'Expert Trainers' },
  { number: '50+', label: 'Weekly Classes' },
]

const timeline = [
  { year: '2014', title: 'Founded', description: 'GymFit opened its first location in Jakarta with a vision to transform fitness culture.' },
  { year: '2016', title: 'Expansion', description: 'Expanded to 3 locations and introduced innovative group class programs.' },
  { year: '2019', title: 'Innovation', description: 'Launched state-of-the-art mobile app and 24/7 access for members.' },
  { year: '2022', title: 'Recognition', description: 'Awarded "Best Gym in Jakarta" by Fitness Magazine Indonesia.' },
  { year: '2025', title: 'Today', description: 'Serving over 5000 members with cutting-edge facilities and world-class trainers.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          className="mb-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 text-5xl font-bold md:text-6xl">
            About <span className="text-green-500">GymFit</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-400">
            Since 2014, we've been on a mission to transform lives through fitness.
            GymFit isn't just a gym—it's a community where people come together to
            push their limits, achieve their goals, and become the best version of themselves.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mb-24 grid grid-cols-2 gap-8 md:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 to-black p-8 text-center"
            >
              <div className="mb-2 text-4xl font-bold text-green-500">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <div className="mb-24 grid gap-8 md:grid-cols-2">
          <motion.div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white">
              Our <span className="text-green-500">Mission</span>
            </h2>
            <p className="leading-relaxed text-gray-400">
              To empower individuals to achieve their fitness goals by providing
              world-class facilities, expert guidance, and a supportive community.
              We believe fitness is not just about physical transformation—it's about
              building confidence, resilience, and a healthier lifestyle.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white">
              Our <span className="text-green-500">Vision</span>
            </h2>
            <p className="leading-relaxed text-gray-400">
              To be Indonesia's leading fitness destination, recognized for excellence
              in training, innovation in wellness technology, and unwavering commitment
              to member success. We aim to inspire a nationwide movement toward
              healthier, more active lifestyles.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="mb-12 text-center text-4xl font-bold text-white">
            Our <span className="text-green-500">Values</span>
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 inline-flex rounded-xl bg-green-500/10 p-4">
                  <value.icon className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{value.title}</h3>
                <p className="text-sm text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="mb-12 text-center text-4xl font-bold text-white">
            Our <span className="text-green-500">Journey</span>
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 h-full w-0.5 bg-green-500/20 md:left-1/2" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 h-4 w-4 rounded-full bg-green-500 md:left-1/2 md:-translate-x-1/2" />

                  {/* Content */}
                  <div className={`ml-20 flex-1 md:ml-0 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    <div className="inline-block rounded-full bg-green-500/10 px-4 py-1 text-sm font-semibold text-green-500">
                      {item.year}
                    </div>
                    <h3 className="mt-2 text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-gray-400">{item.description}</p>
                  </div>

                  <div className="hidden flex-1 md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
