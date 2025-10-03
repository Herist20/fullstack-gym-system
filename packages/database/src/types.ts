// Auto-generated Database Types
// Based on Supabase schema migrations

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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
