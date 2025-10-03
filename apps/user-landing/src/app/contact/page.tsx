'use client'

import { motion } from 'framer-motion'
import { Button } from '@gym/ui'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { useState } from 'react'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['123 Fitness Street', 'Jakarta Selatan 12345', 'Indonesia']
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+62 812 3456 7890', '+62 21 1234 5678', 'WhatsApp Available']
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['info@gymfit.com', 'support@gymfit.com', 'membership@gymfit.com']
  },
  {
    icon: Clock,
    title: 'Opening Hours',
    details: ['Mon-Fri: 05:00 - 23:00', 'Sat-Sun: 06:00 - 22:00', '24/7 for Premium & Elite']
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
            Get In <span className="text-green-500">Touch</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      placeholder="+62 812 3456 7890"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-300">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    >
                      <option value="">Select a subject</option>
                      <option value="membership">Membership Inquiry</option>
                      <option value="classes">Class Information</option>
                      <option value="personal-training">Personal Training</option>
                      <option value="facilities">Facilities & Equipment</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-300">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4 inline-flex rounded-xl bg-green-500/10 p-3">
                  <info.icon className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-400">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Map Placeholder */}
            <motion.div
              className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 to-black"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-12 w-12 text-green-500" />
                  <p className="text-gray-400">Map Integration</p>
                  <p className="text-sm text-gray-500">Google Maps / Mapbox</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            Quick <span className="text-green-500">Answers</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                q: 'What are your membership options?',
                a: 'We offer Basic, Premium, and Elite memberships starting from Rp 299K/month.'
              },
              {
                q: 'Can I try before joining?',
                a: 'Yes! We offer free trial passes and facility tours. Contact us to schedule.'
              },
              {
                q: 'Do you have parking?',
                a: 'Yes, we provide free parking for all members with 24/7 security.'
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
