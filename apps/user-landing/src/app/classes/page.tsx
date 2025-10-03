'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Badge } from '@gym/ui'
import { Clock, Users, Search, Filter } from 'lucide-react'

const categories = ['All', 'Cardio', 'Strength', 'Flexibility', 'HIIT', 'Dance', 'Recovery']

const allClasses = [
  { id: 1, name: 'HIIT Bootcamp', category: 'HIIT', duration: 45, instructor: 'John Davis', maxCapacity: 20, availableSpots: 8, time: '06:00 AM', image: '🔥' },
  { id: 2, name: 'Yoga Flow', category: 'Flexibility', duration: 60, instructor: 'Sarah Lee', maxCapacity: 15, availableSpots: 5, time: '07:00 AM', image: '🧘' },
  { id: 3, name: 'Strength Training', category: 'Strength', duration: 50, instructor: 'Mike Chen', maxCapacity: 25, availableSpots: 12, time: '08:00 AM', image: '💪' },
  { id: 4, name: 'Cardio Blast', category: 'Cardio', duration: 40, instructor: 'Emma Wilson', maxCapacity: 30, availableSpots: 15, time: '09:00 AM', image: '🏃' },
  { id: 5, name: 'Power Lifting', category: 'Strength', duration: 60, instructor: 'Tom Jackson', maxCapacity: 12, availableSpots: 3, time: '10:00 AM', image: '🏋️' },
  { id: 6, name: 'Zumba Dance', category: 'Dance', duration: 45, instructor: 'Maria Garcia', maxCapacity: 25, availableSpots: 10, time: '11:00 AM', image: '💃' },
  { id: 7, name: 'Pilates Core', category: 'Flexibility', duration: 50, instructor: 'Linda Brown', maxCapacity: 15, availableSpots: 7, time: '12:00 PM', image: '🤸' },
  { id: 8, name: 'Boxing Fitness', category: 'HIIT', duration: 45, instructor: 'David Lee', maxCapacity: 20, availableSpots: 6, time: '05:00 PM', image: '🥊' },
  { id: 9, name: 'Stretch & Recovery', category: 'Recovery', duration: 30, instructor: 'Amy Taylor', maxCapacity: 20, availableSpots: 14, time: '06:00 PM', image: '🧘‍♀️' },
]

export default function ClassesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredClasses = allClasses.filter(cls => {
    const matchesCategory = selectedCategory === 'All' || cls.category === selectedCategory
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            Our <span className="text-green-500">Classes</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Choose from our wide variety of classes designed for all fitness levels
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="h-4 w-4" />
            <span>{filteredClasses.length} classes found</span>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="mb-12 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-green-500 text-black'
                  : 'border border-white/10 bg-white/5 text-gray-300 hover:border-green-500/50 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Classes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm transition-all hover:border-green-500/50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="text-5xl">{classItem.image}</div>
                  <Badge variant={classItem.availableSpots < 5 ? 'destructive' : 'default'}>
                    {classItem.availableSpots} spots left
                  </Badge>
                </div>

                {/* Category Badge */}
                <div className="mb-3 inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                  {classItem.category}
                </div>

                {/* Class Info */}
                <h3 className="mb-2 text-xl font-bold text-white">
                  {classItem.name}
                </h3>
                <p className="mb-4 text-sm text-gray-400">
                  with {classItem.instructor}
                </p>

                {/* Details */}
                <div className="mb-6 flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {classItem.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {classItem.maxCapacity} max
                  </span>
                  <span className="font-medium text-green-500">
                    {classItem.time}
                  </span>
                </div>

                {/* Book Button */}
                <Button
                  className="w-full"
                  disabled={classItem.availableSpots === 0}
                >
                  {classItem.availableSpots === 0 ? 'Fully Booked' : 'Book Now'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <motion.div
            className="py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-2xl font-bold text-white">No classes found</h3>
            <p className="text-gray-400">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
