# ✅ Setup Checklist - Gym Management System

Gunakan checklist ini untuk memastikan setup Anda sudah benar!

## 🔧 Prerequisites

- [ ] Node.js v18+ terinstall
  ```bash
  node --version  # Harus >= v18
  ```

- [ ] pnpm terinstall
  ```bash
  pnpm --version
  # Jika belum: npm install -g pnpm
  ```

- [ ] Supabase CLI terinstall
  ```bash
  supabase --version
  # Jika belum: npm install -g supabase
  ```

- [ ] Git terinstall (opsional)
  ```bash
  git --version
  ```

## 📦 Installation

- [ ] Dependencies terinstall
  ```bash
  pnpm install
  # Lihat output, pastikan tidak ada error
  ```

- [ ] File `.env.local` sudah dibuat
  ```bash
  # Harus ada file ini di root project
  ls -la .env.local  # Linux/Mac
  dir .env.local     # Windows
  ```

- [ ] `.env.local` sudah diisi dengan benar:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` terisi
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` terisi
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` terisi
  - [ ] Semua key TIDAK ada tanda petik
  - [ ] Tidak ada spasi sebelum/sesudah `=`

## 🗄️ Supabase Setup

### Cloud Supabase (Recommended)

- [ ] Supabase project sudah dibuat di https://app.supabase.com
- [ ] Project sudah dalam status "Active" (bukan Paused)
- [ ] Database password sudah dicatat/disimpan
- [ ] Project ref sudah dicopy (Settings > General > Reference ID)

- [ ] Project sudah di-link
  ```bash
  supabase link --project-ref <your-ref>
  # Harus success, tidak error
  ```

- [ ] Migrations sudah di-push
  ```bash
  pnpm db:push
  # atau: supabase db push
  # Harus success
  ```

- [ ] Cek di Supabase Dashboard > Table Editor
  - [ ] Ada 10 tables yang terlihat:
    - [ ] users
    - [ ] trainers
    - [ ] memberships
    - [ ] classes
    - [ ] schedules
    - [ ] bookings
    - [ ] attendance
    - [ ] payments
    - [ ] equipment
    - [ ] notifications

- [ ] Cek RLS Policies (pilih salah satu table > Policies tab)
  - [ ] Ada minimal 2-3 policies per table
  - [ ] RLS enabled (toggle di atas)

### Local Supabase (Alternative)

- [ ] Local Supabase sudah running
  ```bash
  supabase start
  # Copy credentials yang muncul
  ```

- [ ] Database sudah di-reset
  ```bash
  supabase db reset
  ```

- [ ] Tables sudah ada (check via dashboard atau CLI)

## 🌱 Seed Data (Optional)

Jika ingin data sample untuk testing:

- [ ] Buka Supabase Dashboard > SQL Editor
- [ ] Copy paste isi file `supabase/seed.sql`
- [ ] Klik RUN
- [ ] Tidak ada error yang muncul
- [ ] Cek table `users` - harus ada 10 rows
- [ ] Cek table `classes` - harus ada 12 rows

**ATAU** buat user manual:

- [ ] Buka Authentication > Users > Add user
- [ ] Buat minimal 1 user untuk testing
- [ ] Note: UUID user, email, password

## 🚀 Development Server

- [ ] Dev server bisa jalan
  ```bash
  pnpm dev
  ```

- [ ] Tidak ada error di terminal
- [ ] Aplikasi bisa dibuka di browser:
  - [ ] http://localhost:3001 (User WebApp) terbuka
  - [ ] http://localhost:3002 (Admin Dashboard) terbuka
  - [ ] http://localhost:3003 (User Landing) terbuka
  - [ ] http://localhost:3004 (Admin Landing) terbuka

## 🔍 Verification Tests

### Test 1: Database Connection

Buat file `test.js` di root:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase.from('classes').select('*').limit(5)
  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log('✅ Success! Found', data.length, 'classes')
  }
}

test()
```

Run:
```bash
node test.js
```

- [ ] Harus print "✅ Success!"
- [ ] Tidak ada error

### Test 2: TypeScript Types

- [ ] File `src/types/database.types.ts` ada
- [ ] File tidak kosong (harus 500+ lines)
- [ ] Import di code tidak error:
  ```typescript
  import { Database } from '@/types/database.types'
  ```

### Test 3: Environment Variables

Cek di browser console (Network tab):

- [ ] Request ke Supabase menggunakan URL yang benar
- [ ] Tidak ada error 401 (Unauthorized)
- [ ] Tidak ada error 404 (Not Found)

## 📝 Final Checks

- [ ] Semua files dokumentasi ada:
  - [ ] README.md
  - [ ] RUN_PROJECT.md
  - [ ] QUICKSTART.md
  - [ ] SETUP_GUIDE.md
  - [ ] PROJECT_SUMMARY.md
  - [ ] CHECKLIST.md (this file)

- [ ] Folder structure benar:
  ```
  gym-system/
  ├── apps/
  ├── packages/
  ├── src/types/
  ├── supabase/migrations/
  ├── .env.local ✓
  ├── package.json ✓
  └── ...
  ```

- [ ] Package.json punya scripts:
  - [ ] `pnpm dev` ✓
  - [ ] `pnpm db:push` ✓
  - [ ] `pnpm types:generate` ✓

## 🎯 Score

Hitung berapa checklist yang ✅:

- **40-45 ✅**: Perfect! Setup complete 🎉
- **30-39 ✅**: Good! Minor issues, cek yang belum
- **20-29 ✅**: Needs work, lihat troubleshooting
- **< 20 ✅**: Start over, ikuti RUN_PROJECT.md

## 🆘 Troubleshooting

Jika ada checklist yang ❌, lihat section troubleshooting di:

- [RUN_PROJECT.md](./RUN_PROJECT.md) - Solusi error umum
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detail teknis
- [supabase/README.md](./supabase/README.md) - Database issues

### Quick Fixes

**Error: Cannot find module**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Error: Invalid API key**
```bash
# Re-check .env.local
# Copy paste ulang dari Supabase Dashboard
# Restart dev server
```

**Error: relation does not exist**
```bash
pnpm db:push
# atau
supabase db push
```

**Port already in use**
```bash
# Ganti port di package.json
# Atau kill process yang pakai port tersebut
```

## ✨ Success!

Jika semua ✅, congratulations! 🎉

Project Anda siap untuk development!

**Next:**
1. Baca [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) untuk overview
2. Mulai coding! 💪
3. Build something awesome! 🚀

---

**Last updated**: 2025-01-03
