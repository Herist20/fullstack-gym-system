// TypeScript types auto-generated from Supabase schema
// This file contains all database table types and enums

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'member' | 'trainer' | 'admin'
          full_name: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'member' | 'trainer' | 'admin'
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'member' | 'trainer' | 'admin'
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trainers: {
        Row: {
          id: string
          user_id: string
          specialization: string[]
          bio: string | null
          rating: number
          years_experience: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          specialization?: string[]
          bio?: string | null
          rating?: number
          years_experience?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          specialization?: string[]
          bio?: string | null
          rating?: number
          years_experience?: number
          created_at?: string
          updated_at?: string
        }
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          membership_type: 'basic' | 'premium' | 'platinum'
          start_date: string
          end_date: string
          status: 'active' | 'expired' | 'cancelled' | 'pending'
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          membership_type: 'basic' | 'premium' | 'platinum'
          start_date: string
          end_date: string
          status?: 'active' | 'expired' | 'cancelled' | 'pending'
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          membership_type?: 'basic' | 'premium' | 'platinum'
          start_date?: string
          end_date?: string
          status?: 'active' | 'expired' | 'cancelled' | 'pending'
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          description: string | null
          instructor_id: string
          duration: number
          max_capacity: number
          category: 'yoga' | 'cardio' | 'strength' | 'pilates' | 'boxing' | 'crossfit' | 'cycling' | 'other'
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          instructor_id: string
          duration: number
          max_capacity: number
          category: 'yoga' | 'cardio' | 'strength' | 'pilates' | 'boxing' | 'crossfit' | 'cycling' | 'other'
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          instructor_id?: string
          duration?: number
          max_capacity?: number
          category?: 'yoga' | 'cardio' | 'strength' | 'pilates' | 'boxing' | 'crossfit' | 'cycling' | 'other'
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          class_id: string
          date: string
          start_time: string
          end_time: string
          available_spots: number
          status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          date: string
          start_time: string
          end_time: string
          available_spots: number
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          date?: string
          start_time?: string
          end_time?: string
          available_spots?: number
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          schedule_id: string
          booking_date: string
          status: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          checked_in: boolean
          cancellation_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          schedule_id: string
          booking_date?: string
          status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          checked_in?: boolean
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          schedule_id?: string
          booking_date?: string
          status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          checked_in?: boolean
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          booking_id: string
          check_in_time: string
          check_out_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          membership_id: string | null
          amount: number
          payment_date: string
          payment_method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          membership_id?: string | null
          amount: number
          payment_date?: string
          payment_method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          membership_id?: string | null
          amount?: number
          payment_date?: string
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      equipment: {
        Row: {
          id: string
          name: string
          category: 'cardio' | 'strength' | 'free_weights' | 'accessories' | 'other'
          status: 'available' | 'maintenance' | 'broken' | 'retired'
          purchase_date: string | null
          last_maintenance: string | null
          next_maintenance: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'cardio' | 'strength' | 'free_weights' | 'accessories' | 'other'
          status?: 'available' | 'maintenance' | 'broken' | 'retired'
          purchase_date?: string | null
          last_maintenance?: string | null
          next_maintenance?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'cardio' | 'strength' | 'free_weights' | 'accessories' | 'other'
          status?: 'available' | 'maintenance' | 'broken' | 'retired'
          purchase_date?: string | null
          last_maintenance?: string | null
          next_maintenance?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'booking' | 'payment' | 'membership' | 'class' | 'system' | 'other'
          read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'booking' | 'payment' | 'membership' | 'class' | 'system' | 'other'
          read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'booking' | 'payment' | 'membership' | 'class' | 'system' | 'other'
          read?: boolean
          link?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_trainer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_member: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_user_bookings: {
        Args: {
          p_user_id: string
          p_status?: string | null
          p_from_date?: string | null
          p_to_date?: string | null
        }
        Returns: Array<{
          booking_id: string
          schedule_id: string
          class_id: string
          class_name: string
          class_category: string
          instructor_name: string
          schedule_date: string
          start_time: string
          end_time: string
          duration: number
          booking_status: string
          checked_in: boolean
          booking_date: string
        }>
      }
      check_class_availability: {
        Args: {
          p_schedule_id: string
        }
        Returns: Array<{
          schedule_id: string
          class_name: string
          date: string
          start_time: string
          end_time: string
          max_capacity: number
          available_spots: number
          is_available: boolean
        }>
      }
      get_upcoming_classes: {
        Args: {
          p_from_date?: string
          p_days?: number
          p_category?: string | null
        }
        Returns: Array<{
          schedule_id: string
          class_id: string
          class_name: string
          class_description: string | null
          class_category: string
          instructor_id: string
          instructor_name: string
          instructor_specialization: string[]
          schedule_date: string
          start_time: string
          end_time: string
          duration: number
          max_capacity: number
          available_spots: number
          is_available: boolean
          image_url: string | null
        }>
      }
      get_trainer_schedule: {
        Args: {
          p_trainer_id: string
          p_from_date?: string
          p_to_date?: string | null
        }
        Returns: Array<{
          schedule_id: string
          class_id: string
          class_name: string
          schedule_date: string
          start_time: string
          end_time: string
          duration: number
          max_capacity: number
          available_spots: number
          booked_count: number
          status: string
        }>
      }
      get_user_active_membership: {
        Args: {
          p_user_id: string
        }
        Returns: Array<{
          membership_id: string
          membership_type: string
          start_date: string
          end_date: string
          days_remaining: number
          status: string
        }>
      }
      get_class_attendance_stats: {
        Args: {
          p_class_id: string
          p_from_date?: string | null
          p_to_date?: string | null
        }
        Returns: Array<{
          total_schedules: number
          total_bookings: number
          total_attended: number
          total_no_shows: number
          attendance_rate: number
          average_attendance: number
        }>
      }
      get_member_statistics: {
        Args: {
          p_user_id: string
        }
        Returns: Array<{
          total_bookings: number
          total_attended: number
          total_cancelled: number
          total_no_shows: number
          attendance_rate: number
          favorite_class_category: string
        }>
      }
      book_class: {
        Args: {
          p_user_id: string
          p_schedule_id: string
        }
        Returns: Array<{
          success: boolean
          message: string
          booking_id: string | null
        }>
      }
      cancel_booking: {
        Args: {
          p_booking_id: string
          p_user_id: string
          p_reason?: string | null
        }
        Returns: Array<{
          success: boolean
          message: string
        }>
      }
      check_in_to_class: {
        Args: {
          p_booking_id: string
        }
        Returns: Array<{
          success: boolean
          message: string
          attendance_id: string | null
        }>
      }
    }
    Enums: {
      user_role: 'member' | 'trainer' | 'admin'
      membership_type: 'basic' | 'premium' | 'platinum'
      membership_status: 'active' | 'expired' | 'cancelled' | 'pending'
      class_category: 'yoga' | 'cardio' | 'strength' | 'pilates' | 'boxing' | 'crossfit' | 'cycling' | 'other'
      schedule_status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
      booking_status: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
      payment_method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      equipment_category: 'cardio' | 'strength' | 'free_weights' | 'accessories' | 'other'
      equipment_status: 'available' | 'maintenance' | 'broken' | 'retired'
      notification_type: 'booking' | 'payment' | 'membership' | 'class' | 'system' | 'other'
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updateable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type User = Tables<'users'>
export type Trainer = Tables<'trainers'>
export type Membership = Tables<'memberships'>
export type Class = Tables<'classes'>
export type Schedule = Tables<'schedules'>
export type Booking = Tables<'bookings'>
export type Attendance = Tables<'attendance'>
export type Payment = Tables<'payments'>
export type Equipment = Tables<'equipment'>
export type Notification = Tables<'notifications'>

// Enum types
export type UserRole = Database['public']['Enums']['user_role']
export type MembershipType = Database['public']['Enums']['membership_type']
export type MembershipStatus = Database['public']['Enums']['membership_status']
export type ClassCategory = Database['public']['Enums']['class_category']
export type ScheduleStatus = Database['public']['Enums']['schedule_status']
export type BookingStatus = Database['public']['Enums']['booking_status']
export type PaymentMethod = Database['public']['Enums']['payment_method']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type EquipmentCategory = Database['public']['Enums']['equipment_category']
export type EquipmentStatus = Database['public']['Enums']['equipment_status']
export type NotificationType = Database['public']['Enums']['notification_type']

// Extended types with relations
export interface UserWithTrainer extends User {
  trainer?: Trainer | null
}

export interface ClassWithInstructor extends Class {
  instructor: Trainer & {
    user: User
  }
}

export interface ScheduleWithClass extends Schedule {
  class: ClassWithInstructor
}

export interface BookingWithDetails extends Booking {
  schedule: ScheduleWithClass
  user: User
}

export interface MembershipWithUser extends Membership {
  user: User
}

export interface AttendanceWithBooking extends Attendance {
  booking: BookingWithDetails
}
