"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Briefcase,
  Clock,
  MapPin,
  Users,
  Heart,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { applicationFormSchema, type ApplicationFormData } from "@/lib/schemas";

const openPositions = [
  {
    id: "trainer",
    title: "Certified Personal Trainer",
    type: "Full-time",
    location: "Multiple Locations",
    department: "Training",
    description:
      "Lead personalized fitness programs, motivate clients, and help them achieve their health goals.",
    requirements: [
      "Certified personal training certification (NASM, ACE, or equivalent)",
      "2+ years of training experience",
      "Strong communication and motivational skills",
      "Knowledge of nutrition and exercise science",
    ],
    salary: "$45,000 - $65,000/year + bonuses",
  },
  {
    id: "receptionist",
    title: "Front Desk Receptionist",
    type: "Full-time / Part-time",
    location: "Downtown Location",
    department: "Operations",
    description:
      "Be the welcoming face of our gym, manage member check-ins, and provide excellent customer service.",
    requirements: [
      "High school diploma or equivalent",
      "1+ year of customer service experience",
      "Excellent communication skills",
      "Proficiency in basic computer applications",
    ],
    salary: "$30,000 - $40,000/year",
  },
  {
    id: "manager",
    title: "Gym Manager",
    type: "Full-time",
    location: "All Locations",
    department: "Management",
    description:
      "Oversee daily operations, manage staff, and ensure exceptional member experiences.",
    requirements: [
      "Bachelor's degree in Business or related field",
      "3+ years of management experience in fitness industry",
      "Strong leadership and organizational skills",
      "P&L management experience",
    ],
    salary: "$55,000 - $75,000/year + bonuses",
  },
];

const cultureValues = [
  {
    icon: Heart,
    title: "Member-Centric",
    description: "We put our members first in everything we do.",
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "We succeed together as a team.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "We focus on achieving measurable outcomes.",
  },
  {
    icon: Sparkles,
    title: "Innovative",
    description: "We embrace new ideas and continuous improvement.",
  },
];

export default function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Application submitted:", data);
      toast.success("Application submitted successfully!", {
        description: "We'll review your application and get back to you soon.",
      });
      reset();
      setSelectedPosition("");
    } catch (error) {
      toast.error("Failed to submit application", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Career Opportunities
            </h1>
            <p className="text-xl sm:text-2xl text-orange-100">
              Join our team and make a difference in people&apos;s lives through fitness
              and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Our Culture & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We foster an environment where passion, professionalism, and growth
              come together.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultureValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 text-center border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 text-orange-600 rounded-full mb-5">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our current job openings and find the perfect role for you.
            </p>
          </div>
          <div className="grid gap-8 mb-12">
            {openPositions.map((position) => (
              <div
                key={position.id}
                className="bg-white border border-gray-200 rounded-lg p-8 hover:border-orange-300 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Briefcase className="h-6 w-6 text-orange-600 mt-1" />
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            {position.type}
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {position.location}
                          </span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                            {position.department}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{position.description}</p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Requirements:
                      </h4>
                      <ul className="space-y-1">
                        {position.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm font-semibold text-orange-600">
                      {position.salary}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPosition(position.id);
                      document
                        .getElementById("application-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl p-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Submit Your Application
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we&apos;ll get back to you soon.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register("firstName")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register("lastName")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Position Details */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Position Details
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position Applying For *
                  </label>
                  <select
                    {...register("position")}
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                  >
                    <option value="">Select a position</option>
                    <option value="trainer">Certified Personal Trainer</option>
                    <option value="receptionist">Front Desk Receptionist</option>
                    <option value="manager">Gym Manager</option>
                  </select>
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.position.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Experience
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience *
                    </label>
                    <input
                      type="text"
                      {...register("yearsOfExperience")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                      placeholder="e.g., 3 years"
                    />
                    {errors.yearsOfExperience && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.yearsOfExperience.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Previous Employer
                    </label>
                    <input
                      type="text"
                      {...register("previousEmployer")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                      placeholder="Company name"
                    />
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications (for trainers)
                </label>
                <input
                  type="text"
                  {...register("certifications")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                  placeholder="e.g., NASM, ACE, ISSA"
                />
              </div>

              {/* Availability */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Availability
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Start Date *
                    </label>
                    <input
                      type="date"
                      {...register("availableStartDate")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                    />
                    {errors.availableStartDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.availableStartDate.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability Details *
                  </label>
                  <textarea
                    {...register("availability")}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none resize-none transition-all duration-200"
                    placeholder="Please describe your availability (e.g., Full-time, weekdays, flexible hours)"
                  />
                  {errors.availability && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.availability.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div className="pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter *
                </label>
                <textarea
                  {...register("coverLetter")}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none resize-none transition-all duration-200"
                  placeholder="Tell us why you want to join our team and what makes you a great fit..."
                />
                {errors.coverLetter && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.coverLetter.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
                <Link
                  href="/"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
