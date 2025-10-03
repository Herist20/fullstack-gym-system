'use client'

import { motion } from 'framer-motion'
import { Button } from '@gym/ui'
import { ArrowRight, Dumbbell, Users, Trophy, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-black to-black" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
                Transform Your
                <br />
                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Body & Mind
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="mb-10 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join GymFit and experience world-class training with expert trainers,
              state-of-the-art equipment, and a community that supports your fitness journey.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button size="lg" className="group">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                View Classes
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-3 flex justify-center">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-white">5000+</div>
                <div className="text-xs text-gray-500">Active Members</div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-3 flex justify-center">
                  <Dumbbell className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-xs text-gray-500">Classes Weekly</div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-3 flex justify-center">
                  <Trophy className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-white">20+</div>
                <div className="text-xs text-gray-500">Expert Trainers</div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-3 flex justify-center">
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-xs text-gray-500">Open Access</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-500">Scroll to explore</span>
            <div className="flex h-8 w-5 items-center justify-center rounded-full border-2 border-gray-600">
              <motion.div
                className="h-2 w-1 rounded-full bg-gray-600"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-black py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Why Choose <span className="text-green-500">GymFit</span>
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-400 md:text-base">
              Everything you need to achieve your fitness goals in one place
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Dumbbell,
                title: 'Modern Equipment',
                description: 'State-of-the-art machines and free weights for all fitness levels'
              },
              {
                icon: Users,
                title: 'Expert Trainers',
                description: 'Certified professionals dedicated to your success and safety'
              },
              {
                icon: Trophy,
                title: 'Group Classes',
                description: 'Diverse classes from yoga to HIIT led by experienced instructors'
              },
              {
                icon: Clock,
                title: '24/7 Access',
                description: 'Train on your schedule with round-the-clock facility access'
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Join a supportive community that motivates and inspires'
              },
              {
                icon: Trophy,
                title: 'Results Driven',
                description: 'Proven programs designed to help you reach your goals faster'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-green-500/50 hover:bg-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 inline-flex rounded-lg bg-green-500/10 p-3">
                  <feature.icon className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Classes Section */}
      <section className="bg-gradient-to-b from-black to-gray-900/50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Popular <span className="text-green-500">Classes</span>
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-400 md:text-base">
              Find the perfect class that matches your fitness goals
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'HIIT Training',
                category: 'Cardio',
                duration: 45,
                image: '🔥',
                spots: 8
              },
              {
                name: 'Yoga Flow',
                category: 'Flexibility',
                duration: 60,
                image: '🧘',
                spots: 5
              },
              {
                name: 'Strength Training',
                category: 'Strength',
                duration: 50,
                image: '💪',
                spots: 12
              }
            ].map((classItem, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm transition-all hover:border-green-500/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className="mb-4 text-5xl">{classItem.image}</div>
                  <div className="mb-3 inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                    {classItem.category}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {classItem.name}
                  </h3>
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {classItem.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {classItem.spots} spots
                    </span>
                  </div>
                  <Button className="w-full" variant="outline" size="sm">
                    Book Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" variant="outline">
              View All Classes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-b from-gray-900/50 to-black py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Flexible <span className="text-green-500">Membership</span>
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-400 md:text-base">
              Choose the plan that works best for your lifestyle
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Basic',
                price: 299000,
                period: 'month',
                features: [
                  'Access to gym facilities',
                  'Standard equipment',
                  'Locker room access',
                  'Mobile app access'
                ],
                popular: false
              },
              {
                name: 'Premium',
                price: 499000,
                period: 'month',
                features: [
                  'All Basic features',
                  'Unlimited group classes',
                  'Personal trainer (2x/month)',
                  'Nutrition consultation',
                  'Guest pass (2x/month)'
                ],
                popular: true
              },
              {
                name: 'Elite',
                price: 799000,
                period: 'month',
                features: [
                  'All Premium features',
                  'Personal trainer (8x/month)',
                  'Priority class booking',
                  'Recovery zone access',
                  'Unlimited guest passes',
                  'Free merchandise'
                ],
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col overflow-hidden rounded-xl border p-6 ${
                  plan.popular
                    ? 'border-green-500 bg-gradient-to-br from-green-500/10 to-black shadow-lg shadow-green-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-black">
                    Most Popular
                  </div>
                )}

                <h3 className="mb-2 text-xl font-bold text-white">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">
                    Rp {(plan.price / 1000).toFixed(0)}K
                  </span>
                  <span className="text-sm text-gray-400">/{plan.period}</span>
                </div>

                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="sm"
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-black py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Member <span className="text-green-500">Success Stories</span>
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-400 md:text-base">
              Real results from real people
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Sarah Johnson',
                result: 'Lost 15kg in 6 months',
                quote: 'GymFit transformed my life. The trainers are incredible and the community is so supportive!',
                avatar: '👩'
              },
              {
                name: 'Michael Chen',
                result: 'Gained 8kg muscle',
                quote: 'Best gym in Jakarta! The equipment is top-notch and the classes are always engaging.',
                avatar: '👨'
              },
              {
                name: 'Amanda Rose',
                result: 'Improved flexibility',
                quote: 'The yoga classes here are amazing. I feel stronger and more flexible than ever before.',
                avatar: '👩‍🦰'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-green-500">{testimonial.result}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">&ldquo;{testimonial.quote}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-black p-10 text-center md:p-16"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                Ready to Transform Your Life?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
                Join thousands of members who have already started their fitness journey with GymFit
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-green-400/10 blur-3xl" />
          </motion.div>
        </div>
      </section>
    </>
  )
}
