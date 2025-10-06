export interface User {
  id: string;
  email: string;
  role: 'member' | 'trainer' | 'admin';
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'admin' | 'trainer';
  permissions: Record<string, boolean>;
  is_active: boolean;
  last_login?: string;
  user?: User;
}

export interface Member extends User {
  membership?: Membership;
  status?: 'active' | 'suspended' | 'inactive';
}

export interface Membership {
  id: string;
  user_id: string;
  membership_type: 'basic' | 'premium' | 'platinum';
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Trainer {
  id: string;
  user_id: string;
  specialization: string[];
  bio?: string;
  rating: number;
  years_experience: number;
  user?: User;
  certifications?: TrainerCertification[];
}

export interface TrainerCertification {
  id: string;
  trainer_id: string;
  name: string;
  issuing_organization?: string;
  issue_date?: string;
  expiry_date?: string;
  certificate_url?: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  instructor_id: string;
  duration: number;
  max_capacity: number;
  category: 'yoga' | 'cardio' | 'strength' | 'pilates' | 'boxing' | 'crossfit' | 'cycling' | 'other';
  image_url?: string;
  is_active: boolean;
  instructor?: Trainer;
}

export interface GymClass {
  id: string;
  name: string;
  description?: string;
  trainer_id?: string;
  capacity: number;
  duration_minutes: number;
  difficulty_level?: string;
  price?: number;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  trainer?: {
    id: string;
    full_name: string;
  };
}

export interface Schedule {
  id: string;
  class_id: string;
  trainer_id?: string;
  date?: string;
  start_time: string;
  end_time: string;
  available_spots?: number;
  max_capacity?: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  class?: GymClass;
  trainer?: {
    id: string;
    full_name: string;
  };
  bookings?: any[];
}

export interface Booking {
  id: string;
  user_id: string;
  schedule_id: string;
  booking_date: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  checked_in: boolean;
  cancellation_reason?: string;
  user?: User;
  schedule?: Schedule;
}

export interface Payment {
  id: string;
  user_id: string;
  membership_id?: string;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  notes?: string;
  user?: User;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  membership_id?: string;
  payment_id?: string;
  amount: number;
  payment_method?: string;
  type?: 'membership' | 'class' | 'product' | 'service' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  invoice_url?: string;
  receipt_url?: string;
  transaction_metadata?: Record<string, any>;
  metadata?: Record<string, any>;
  user?: User;
  membership?: any;
  created_at: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'free_weights' | 'accessories' | 'other';
  status: 'available' | 'maintenance' | 'broken' | 'retired';
  purchase_date?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  notes?: string;
  maintenance_logs?: EquipmentMaintenanceLog[];
}

export interface EquipmentMaintenanceLog {
  id: string;
  equipment_id: string;
  maintenance_type: 'routine' | 'repair' | 'replacement' | 'inspection';
  performed_by?: string;
  performed_at: string;
  description?: string;
  cost?: number;
  next_maintenance_date?: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  admin?: AdminUser;
}

export interface GymSettings {
  id: string;
  key: string;
  value: Record<string, any>;
  description?: string;
  updated_by?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  type: string;
  description?: string;
  price: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  is_active: boolean;
}

export interface DashboardMetrics {
  totalMembers: number;
  activeToday: number;
  revenueMTD: number;
  classOccupancy: number;
  memberGrowth: { month: string; count: number }[];
  revenueData: { date: string; amount: number }[];
  popularClasses: { name: string; bookings: number }[];
  recentBookings: Booking[];
}
