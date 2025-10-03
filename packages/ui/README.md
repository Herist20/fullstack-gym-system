# @gym/ui

Gym-themed UI component library built with shadcn/ui and Tailwind CSS.

## Features

- ✅ shadcn/ui base components
- ✅ Custom gym-themed components
- ✅ Form components dengan react-hook-form + zod
- ✅ Dark mode support
- ✅ Fully typed dengan TypeScript
- ✅ Responsive & accessible

## Installation

```bash
pnpm add @gym/ui
```

## Base Components

### Button

```tsx
import { Button } from '@gym/ui'

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Input & Form

```tsx
import { Input, Label, Form, FormField } from '@gym/ui'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@gym/ui'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Badge

```tsx
import { Badge } from '@gym/ui'

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
```

### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@gym/ui'

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogTitle>Dialog Title</DialogTitle>
    Content here
  </DialogContent>
</Dialog>
```

### Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@gym/ui'

<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

## Custom Gym Components

### ClassCard

```tsx
import { ClassCard } from '@gym/ui'

<ClassCard
  id="class-1"
  name="Yoga Morning"
  description="Start your day with yoga"
  instructor={{ name: 'John Doe', avatar: '/avatar.jpg' }}
  category="yoga"
  duration={60}
  maxCapacity={20}
  availableSpots={5}
  schedule={{
    date: '2025-01-15',
    startTime: '08:00',
    endTime: '09:00'
  }}
  onBook={(id) => console.log('Book:', id)}
  onViewDetails={(id) => console.log('View:', id)}
/>
```

### MembershipCard

```tsx
import { MembershipCard } from '@gym/ui'

<MembershipCard
  id="plan-1"
  name="Premium"
  description="Best value for serious athletes"
  price={750000}
  duration={30}
  features={[
    'Unlimited gym access',
    '10 personal training sessions',
    'Free nutrition consultation'
  ]}
  popular={true}
  onSelect={(id) => console.log('Select:', id)}
/>
```

### StatCard

```tsx
import { StatCard } from '@gym/ui'
import { Users } from 'lucide-react'

<StatCard
  title="Total Members"
  value="1,234"
  description="from last month"
  icon={Users}
  trend={{ value: 12.5, isPositive: true }}
/>
```

### BookingCalendar

```tsx
import { BookingCalendar } from '@gym/ui'

const slots = [
  {
    id: '1',
    startTime: '08:00',
    endTime: '09:00',
    className: 'Yoga',
    instructor: 'John',
    availableSpots: 5,
    maxCapacity: 20,
    status: 'available'
  }
]

<BookingCalendar
  selectedDate={new Date()}
  onDateChange={(date) => console.log(date)}
  slots={slots}
  onSlotClick={(id) => console.log('Slot:', id)}
/>
```

## Utility Functions

```tsx
import { cn, formatCurrency, formatDate, getInitials } from '@gym/ui'

// Merge Tailwind classes
cn('text-red-500', 'font-bold') // 'text-red-500 font-bold'

// Format currency (IDR)
formatCurrency(750000) // 'Rp 750.000'

// Format date
formatDate(new Date(), 'short') // '15 Jan 2025'
formatDate(new Date(), 'long') // '15 Januari 2025'

// Get initials
getInitials('John Doe') // 'JD'
```

## Styling

All components use Tailwind CSS. Make sure to configure your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './node_modules/@gym/ui/**/*.{js,ts,jsx,tsx}',
    // your other content paths
  ],
  theme: {
    extend: {
      colors: {
        'gym-primary': '#your-color',
        'gym-secondary': '#your-color',
      }
    }
  }
}
```
