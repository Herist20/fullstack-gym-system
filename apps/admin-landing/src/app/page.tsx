"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Dumbbell,
  TrendingUp,
  Users,
  Heart,
  Award,
  Clock,
  DollarSign,
  GraduationCap,
  ArrowRight,
  Star,
  ChevronDown,
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Compensation",
    description:
      "Industry-leading salary packages with performance bonuses and quarterly incentives.",
  },
  {
    icon: GraduationCap,
    title: "Professional Development",
    description:
      "Access to certifications, workshops, and continuous learning opportunities to advance your career.",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description:
      "Comprehensive health insurance, free gym membership, and wellness programs for you and your family.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "Work-life balance with flexible hours, paid time off, and holiday benefits.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Clear advancement paths with mentorship programs and leadership opportunities.",
  },
  {
    icon: Users,
    title: "Supportive Team",
    description:
      "Join a collaborative environment where teamwork and innovation are celebrated.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Senior Trainer",
    image: "SJ",
    quote:
      "Joining this team was the best decision of my career. The support and growth opportunities are unmatched in the fitness industry.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Gym Manager",
    image: "MC",
    quote:
      "The professional environment and commitment to excellence make this an amazing place to work. I've grown so much in my role.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Receptionist",
    image: "ER",
    quote:
      "Great benefits, supportive colleagues, and a positive work culture. I love coming to work every day!",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-gray-900 text-white h-[calc(100vh-64px)] flex items-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border border-orange-400/30 mb-6">
                <Award className="h-5 w-5" />
                <span className="text-base font-medium">Now Hiring Top Talent</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Transform Lives as a
                <span className="block text-orange-300 mt-2">Fitness Professional</span>
              </h1>
              <p className="text-lg sm:text-xl text-orange-100 mb-8 leading-relaxed">
                Join our elite team of trainers, coaches, and fitness experts. Build
                a rewarding career while helping others achieve their fitness goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-base"
                >
                  View Open Positions
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200 text-base"
                >
                  Staff Login
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400 rounded-full blur-3xl opacity-30"></div>
                <Dumbbell className="relative h-56 w-56 text-orange-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center transform transition-all duration-200 hover:scale-105">
              <div className="text-5xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-base text-gray-600">Team Members</div>
            </div>
            <div className="text-center transform transition-all duration-200 hover:scale-105">
              <div className="text-5xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-base text-gray-600">Locations</div>
            </div>
            <div className="text-center transform transition-all duration-200 hover:scale-105">
              <div className="text-5xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-base text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center transform transition-all duration-200 hover:scale-105">
              <div className="text-5xl font-bold text-orange-600 mb-2">10+</div>
              <div className="text-base text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Join Our Team?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We invest in our people and provide the tools, support, and
              opportunities for you to succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:border-orange-300 hover:shadow-xl transition-all duration-200 group transform hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 text-orange-600 rounded-lg mb-5 group-hover:bg-orange-600 group-hover:text-white transition-all duration-200">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            We are looking for passionate, dedicated professionals to join our team.
            Submit your application today!
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Apply Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              What Our Team Says
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our staff members about their experiences working with us.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-lg">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
