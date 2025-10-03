import { createClient, SupabaseClient as SupabaseClientType, RealtimeChannel } from '@supabase/supabase-js'
import type { Database, Tables, TablesInsert, TablesUpdate } from './types'

export type SupabaseClient = SupabaseClientType<Database>

/**
 * Create a typed Supabase client
 */
export function createDatabaseClient(supabaseUrl: string, supabaseKey: string): SupabaseClient {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

/**
 * Database query helpers with TypeScript generics
 */
export class DatabaseHelpers<T extends keyof Database['public']['Tables']> {
  constructor(
    private client: SupabaseClient,
    private tableName: T
  ) {}

  /**
   * Get all records with optional filtering
   */
  async getAll(options?: {
    filter?: Partial<Tables<T>>
    limit?: number
    orderBy?: { column: keyof Tables<T>; ascending?: boolean }
  }) {
    let query = this.client.from(this.tableName).select('*')

    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value)
        }
      })
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column as string, {
        ascending: options.orderBy.ascending ?? true,
      })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw new DatabaseError(error.message, error)
    return (data as any) as Tables<T>[]
  }

  /**
   * Get a single record by ID
   */
  async getById(id: string) {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('id', id as any)
      .single()

    if (error) throw new DatabaseError(error.message, error)
    return (data as any) as Tables<T>
  }

  /**
   * Create a new record
   */
  async create(record: TablesInsert<T>) {
    const { data, error } = await this.client
      .from(this.tableName)
      .insert(record as any)
      .select()
      .single()

    if (error) throw new DatabaseError(error.message, error)
    return (data as any) as Tables<T>
  }

  /**
   * Update a record by ID
   */
  async update(id: string, updates: TablesUpdate<T>) {
    const { data, error } = await this.client
      .from(this.tableName)
      .update(updates as any)
      .eq('id', id as any)
      .select()
      .single()

    if (error) throw new DatabaseError(error.message, error)
    return (data as any) as Tables<T>
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string) {
    const { error } = await this.client.from(this.tableName).delete().eq('id', id as any)

    if (error) throw new DatabaseError(error.message, error)
    return true
  }

  /**
   * Count records with optional filtering
   */
  async count(filter?: Partial<Tables<T>>) {
    let query = this.client.from(this.tableName).select('*', { count: 'exact', head: true })

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value)
        }
      })
    }

    const { count, error } = await query

    if (error) throw new DatabaseError(error.message, error)
    return count ?? 0
  }

  /**
   * Check if a record exists
   */
  async exists(id: string) {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('id')
      .eq('id', id as any)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new DatabaseError(error.message, error)
    }

    return !!data
  }
}

/**
 * Real-time subscription utilities
 */
export class RealtimeHelpers<T extends keyof Database['public']['Tables']> {
  private channel: RealtimeChannel | null = null

  constructor(
    private client: SupabaseClient,
    private tableName: T
  ) {}

  /**
   * Subscribe to INSERT events
   */
  onInsert(callback: (payload: Tables<T>) => void) {
    this.channel = this.client
      .channel(`${String(this.tableName)}_insert`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: String(this.tableName),
        },
        (payload) => callback(payload.new as Tables<T>)
      )
      .subscribe()

    return this
  }

  /**
   * Subscribe to UPDATE events
   */
  onUpdate(callback: (payload: Tables<T>) => void) {
    this.channel = this.client
      .channel(`${String(this.tableName)}_update`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: String(this.tableName),
        },
        (payload) => callback(payload.new as Tables<T>)
      )
      .subscribe()

    return this
  }

  /**
   * Subscribe to DELETE events
   */
  onDelete(callback: (payload: Tables<T>) => void) {
    this.channel = this.client
      .channel(`${String(this.tableName)}_delete`)
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: String(this.tableName),
        },
        (payload) => callback(payload.old as Tables<T>)
      )
      .subscribe()

    return this
  }

  /**
   * Subscribe to all events
   */
  onChange(callback: (event: 'INSERT' | 'UPDATE' | 'DELETE', payload: Tables<T>) => void) {
    this.channel = this.client
      .channel(`${String(this.tableName)}_all`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: String(this.tableName),
        },
        (payload) => {
          const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
          const data = (payload.new || payload.old) as Tables<T>
          callback(event, data)
        }
      )
      .subscribe()

    return this
  }

  /**
   * Unsubscribe from all events
   */
  unsubscribe() {
    if (this.channel) {
      this.client.removeChannel(this.channel)
      this.channel = null
    }
  }
}

/**
 * Custom Database Error class
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public originalError?: any
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/**
 * Error handling wrapper for database operations
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error
    }
    throw new DatabaseError(errorMessage || 'Database operation failed', error)
  }
}

/**
 * Factory function to create database helpers for a specific table
 */
export function createHelpers<T extends keyof Database['public']['Tables']>(
  client: SupabaseClient,
  tableName: T
) {
  return {
    db: new DatabaseHelpers(client, tableName),
    realtime: new RealtimeHelpers(client, tableName),
  }
}
