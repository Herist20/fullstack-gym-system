'use client'

import { motion } from 'framer-motion'
import { Button } from '@gym/ui'
import { Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: 299000,
    period: 'month',
    description: 'Perfect for getting started with your fitness journey',
    features: [
      'Access to gym facilities during operating hours',
      'Use of standard cardio and strength equipment',
      'Locker room and shower facilities',
      'Mobile app access for class schedules',
      'Free initial fitness assessment',
    ],
    notIncluded: [
      'Group classes',
      'Personal training sessions',
      'Guest passes',
      'Nutrition consultation',
    ],
    popular: false,
    color: 'gray'
  },
  {
    name: 'Premium',
    price: 499000,
    period: 'month',
    description: 'Our most popular choice for serious fitness enthusiasts',
    features: [
      'Everything in Basic plan',
      'Unlimited access to all group classes',
      '2 personal training sessions per month',
      'Quarterly nutrition consultation',
      '2 guest passes per month',
      'Priority booking for popular classes',
      'Access to recovery zone (sauna, cold plunge)',
    ],
    notIncluded: [
      'Unlimited personal training',
      'Private training studio access',
    ],
    popular: true,
    color: 'green'
  },
  {
    name: 'Elite',
    price: 799000,
    period: 'month',
    description: 'Ultimate package for maximum results and convenience',
    features: [
      'Everything in Premium plan',
      '8 personal training sessions per month',
      'Unlimited guest passes',
      'Monthly nutrition and meal planning',
      'Priority access to all facilities (24/7)',
      'Private training studio access',
      'Complimentary gym merchandise',
      'Free body composition analysis (monthly)',
      'Exclusive members-only events',
    ],
    notIncluded: [],
    popular: false,
    color: 'yellow'
  },
]

const comparisonFeatures = [
  { feature: 'Gym Access', basic: 'Operating Hours', premium: '24/7', elite: '24/7 Priority' },
  { feature: 'Group Classes', basic: '-', premium: 'Unlimited', elite: 'Unlimited Priority' },
  { feature: 'Personal Training', basic: '-', premium: '2/month', elite: '8/month' },
  { feature: 'Guest Passes', basic: '-', premium: '2/month', elite: 'Unlimited' },
  { feature: 'Nutrition Support', basic: '-', premium: 'Quarterly', elite: 'Monthly + Meal Plans' },
]

export default function MembershipPage() {
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
            Choose Your <span className="text-green-500">Membership</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Flexible plans designed to fit your lifestyle and fitness goals
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mb-24 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative overflow-hidden rounded-2xl border p-8 ${
                plan.popular
                  ? 'border-green-500 bg-gradient-to-br from-green-500/10 to-black scale-105 lg:scale-110'
                  : 'border-white/10 bg-white/5'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute right-4 top-4 rounded-full bg-green-500 px-4 py-1 text-xs font-semibold text-black">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-400">Rp</span>
                  <span className="text-5xl font-bold text-white">
                    {(plan.price / 1000).toFixed(0)}K
                  </span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </div>

              <Button
                className="mb-8 w-full"
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="space-y-4">
                <div className="text-sm font-semibold text-white">What's included:</div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            Compare <span className="text-green-500">Plans</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full rounded-2xl border border-white/10 bg-white/5">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-white">Feature</th>
                  <th className="p-4 text-center text-white">Basic</th>
                  <th className="p-4 text-center text-green-500">Premium</th>
                  <th className="p-4 text-center text-white">Elite</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-gray-300">{row.feature}</td>
                    <td className="p-4 text-center text-gray-400">{row.basic}</td>
                    <td className="p-4 text-center font-semibold text-green-500">{row.premium}</td>
                    <td className="p-4 text-center text-gray-300">{row.elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            Frequently Asked <span className="text-green-500">Questions</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: 'Can I cancel my membership anytime?',
                a: 'Yes, you can cancel anytime with 30 days notice. No hidden fees or penalties.'
              },
              {
                q: 'Do you offer day passes?',
                a: 'Yes, day passes are available for Rp 75K. Perfect for trying out our facilities.'
              },
              {
                q: 'Are there any enrollment fees?',
                a: 'No enrollment or hidden fees. Pay only the monthly membership price.'
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Absolutely! You can change plans anytime, effective from the next billing cycle.'
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-semibold text-white">{faq.q}</h3>
                <p className="text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
