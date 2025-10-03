# 📝 Update Seed UIDs

Setelah buat auth users di Supabase, copy UID mereka dan ganti di `seed.sql`

## 🔍 Cara Dapat UIDs:

1. Buka: https://app.supabase.com/project/lcvaffwkfipwqcqcbjjv/auth/users
2. Klik user → Copy UID (format: `abc12345-1234-...`)
3. Replace di seed.sql

## 📋 Template Replace:

Buka `supabase/seed.sql`, find & replace:

```sql
-- BEFORE (dummy IDs):
'00000000-0000-0000-0000-000000000001'  -- admin
'00000000-0000-0000-0000-000000000002'  -- john trainer
'00000000-0000-0000-0000-000000000003'  -- sarah trainer
'00000000-0000-0000-0000-000000000004'  -- mike trainer
'00000000-0000-0000-0000-000000000005'  -- emma trainer
'00000000-0000-0000-0000-000000000010'  -- member1
'00000000-0000-0000-0000-000000000011'  -- member2
'00000000-0000-0000-0000-000000000012'  -- member3
'00000000-0000-0000-0000-000000000013'  -- member4
'00000000-0000-0000-0000-000000000014'  -- member5

-- AFTER (real UIDs from Supabase Auth):
'<paste-admin-uid-here>'      -- admin@gymfit.com
'<paste-john-uid-here>'        -- john.trainer@gymfit.com
'<paste-sarah-uid-here>'       -- sarah.trainer@gymfit.com
'<paste-mike-uid-here>'        -- mike.trainer@gymfit.com
'<paste-emma-uid-here>'        -- emma.trainer@gymfit.com
'<paste-member1-uid-here>'     -- member1@gmail.com
'<paste-member2-uid-here>'     -- member2@gmail.com
'<paste-member3-uid-here>'     -- member3@gmail.com
'<paste-member4-uid-here>'     -- member4@gmail.com
'<paste-member5-uid-here>'     -- member5@gmail.com
```

## 🔄 Quick Replace di VS Code:

1. Buka `seed.sql`
2. Ctrl+H (Find & Replace)
3. Replace setiap dummy ID dengan real UID
4. Save file

Setelah itu, run seed.sql di Supabase SQL Editor!
