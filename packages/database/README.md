# @gym/database

Typed Supabase client library dengan query helpers dan real-time utilities.

## Features

- ✅ Complete TypeScript types untuk semua database tables
- ✅ Generic query helpers (CRUD operations)
- ✅ Real-time subscription utilities
- ✅ Error handling wrapper
- ✅ Fully typed dengan TypeScript

## Installation

```bash
pnpm add @gym/database
```

## Usage

### Create Supabase Client

```typescript
import { createDatabaseClient } from '@gym/database'

const supabase = createDatabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Database Helpers

```typescript
import { createHelpers } from '@gym/database'

const { db, realtime } = createHelpers(supabase, 'classes')

// Get all classes
const classes = await db.getAll({ limit: 10 })

// Get by ID
const classItem = await db.getById('class-id')

// Create
const newClass = await db.create({
  name: 'Yoga Class',
  duration: 60,
  max_capacity: 20,
  // ...
})

// Update
const updated = await db.update('class-id', { name: 'New Name' })

// Delete
await db.delete('class-id')

// Count
const total = await db.count({ category: 'yoga' })

// Check exists
const exists = await db.exists('class-id')
```

### Real-time Subscriptions

```typescript
// Subscribe to INSERT events
realtime.onInsert((newClass) => {
  console.log('New class added:', newClass)
})

// Subscribe to UPDATE events
realtime.onUpdate((updatedClass) => {
  console.log('Class updated:', updatedClass)
})

// Subscribe to DELETE events
realtime.onDelete((deletedClass) => {
  console.log('Class deleted:', deletedClass)
})

// Subscribe to all events
realtime.onChange((event, data) => {
  console.log(`Event: ${event}`, data)
})

// Unsubscribe
realtime.unsubscribe()
```

## Types

All database types are auto-generated and fully typed:

```typescript
import type { Tables, TablesInsert, TablesUpdate } from '@gym/database'

// Table types
type User = Tables<'users'>
type Class = Tables<'classes'>

// Insert types
type UserInsert = TablesInsert<'users'>

// Update types
type UserUpdate = TablesUpdate<'users'>
```
