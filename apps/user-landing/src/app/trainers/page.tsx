'use client'

import { motion } from 'framer-motion'
import { Button, Badge } from '@gym/ui'
import { Award, Star, Calendar } from 'lucide-react'

const trainers = [
  {
    id: 1,
    name: 'John Davis',
    specialization: 'HIIT & Strength',
    experience: '8 years',
    certifications: ['NASM-CPT', 'CrossFit L2'],
    rating: 4.9,
    clients: 120,
    avatar: '👨‍🏫',
    bio: 'Specializing in high-intensity training and strength building programs.'
  },
  {
    id: 2,
    name: 'Sarah Lee',
    specialization: 'Yoga & Flexibility',
    experience: '6 years',
    certifications: ['RYT-500', 'Pilates Instructor'],
    rating: 5.0,
    clients: 95,
    avatar: '👩‍🏫',
    bio: 'Expert in yoga, mindfulness, and flexibility training for all levels.'
  },
  {
    id: 3,
    name: 'Mike Chen',
    specialization: 'Bodybuilding',
    experience: '10 years',
    certifications: ['ISSA-CPT', 'Sports Nutrition'],
    rating: 4.8,
    clients: 150,
    avatar: '👨‍💼',
    bio: 'Professional bodybuilder turned trainer, focused on muscle growth and nutrition.'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    specialization: 'Cardio & Weight Loss',
    experience: '5 years',
    certifications: ['ACE-CPT', 'TRX Certified'],
    rating: 4.9,
    clients: 110,
    avatar: '👩‍💼',
    bio: 'Passionate about helping clients achieve their weight loss goals through cardio.'
  },
  {
    id: 5,
    name: 'Tom Jackson',
    specialization: 'Powerlifting',
    experience: '12 years',
    certifications: ['USAPL Coach', 'Strength & Conditioning'],
    rating: 5.0,
    clients: 85,
    avatar: '🧔',
    bio: 'Former competitive powerlifter with extensive coaching experience.'
  },
  {
    id: 6,
    name: 'Maria Garcia',
    specialization: 'Dance Fitness',
    experience: '7 years',
    certifications: ['Zumba Instructor', 'Dance Fitness'],
    rating: 4.9,
    clients: 130,
    avatar: '👩‍🎤',
    bio: 'Making fitness fun through dance and high-energy group classes.'
  },
]

export default function TrainersPage() {
  return (
    <div className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            Expert <span className="text-green-500">Trainers</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Meet our certified professionals dedicated to helping you achieve your fitness goals
          </p>
        </motion.div>

        {/* Trainers Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm transition-all hover:border-green-500/50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-8">
                {/* Avatar & Rating */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="text-6xl">{trainer.avatar}</div>
                  <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-500">{trainer.rating}</span>
                  </div>
                </div>

                {/* Name & Specialization */}
                <h3 className="mb-1 text-2xl font-bold text-white">{trainer.name}</h3>
                <p className="mb-4 text-green-500">{trainer.specialization}</p>

                {/* Bio */}
                <p className="mb-6 text-sm text-gray-400">{trainer.bio}</p>

                {/* Stats */}
                <div className="mb-6 flex gap-4">
                  <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <div className="text-xl font-bold text-white">{trainer.experience}</div>
                    <div className="text-xs text-gray-400">Experience</div>
                  </div>
                  <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <div className="text-xl font-bold text-white">{trainer.clients}</div>
                    <div className="text-xs text-gray-400">Clients</div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                    <Award className="h-4 w-4" />
                    <span>Certifications</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trainer.certifications.map((cert, i) => (
                      <Badge key={i} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Book Button */}
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Session
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-black p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Not sure which trainer is right for you?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-gray-400">
            Book a free consultation and we'll match you with the perfect trainer for your goals
          </p>
          <Button size="lg">Schedule Free Consultation</Button>
        </motion.div>
      </div>
    </div>
  )
}
