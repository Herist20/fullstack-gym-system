import { z } from "zod";

export const applicationFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),

  // Position Details
  position: z.enum(["trainer", "receptionist", "manager"], {
    required_error: "Please select a position",
  }),

  // Experience
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  previousEmployer: z.string().optional(),

  // Certifications (for trainers)
  certifications: z.string().optional(),

  // Availability
  availableStartDate: z.string().min(1, "Start date is required"),
  availability: z.string().min(10, "Please provide your availability details"),

  // Additional Information
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),

  // Resume
  resumeUrl: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
