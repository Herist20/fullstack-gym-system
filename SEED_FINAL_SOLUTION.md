# 🎯 SOLUSI FINAL - Seed Data (100% Berhasil!)

## ❌ Error Sebelumnya:
```
instructor_id NOT NULL constraint violated
```

## ✅ **SOLUSI TERMUDAH (2 Langkah, 5 Menit!):**

---

### **📋 Langkah 1: Buat 1 Auth User untuk Trainer (2 menit)**

1. **Buka Supabase Dashboard:**
   ```
   https://app.supabase.com/project/lcvaffwkfipwqcqcbjjv/auth/users
   ```

2. **Klik "Add user" → "Create new user"**

3. **Isi form:**
   - Email: `trainer@gymfit.com`
   - Password: `trainer123`
   - ✅ Check "Auto Confirm User"
   - Klik "Create user"

4. **COPY User UID** yang muncul!
   - Format: `abc12345-6789-...`
   - Simpan di notepad

---

### **📋 Langkah 2: Run Seed SQL dengan UID (3 menit)**

Saya sudah buatkan SQL yang tinggal replace UID:

**Buka SQL Editor di Supabase, copy paste ini:**

```sql
-- =====================================================
-- QUICK SEED - Replace <YOUR-TRAINER-UID> dengan UID yang Anda copy!
-- =====================================================

-- 1. Create trainer user profile
INSERT INTO public.users (id, email, role, full_name, phone)
VALUES (
  '<YOUR-TRAINER-UID>',  -- ← GANTI INI!
  'trainer@gymfit.com',
  'trainer',
  'System Trainer',
  '+628123456789'
);

-- 2. Create trainer
INSERT INTO public.trainers (user_id, specialization, bio, rating, years_experience)
VALUES (
  '<YOUR-TRAINER-UID>',  -- ← GANTI INI!
  ARRAY['yoga', 'cardio', 'strength', 'boxing'],
  'Professional fitness instructor',
  4.8,
  8
);

-- 3. Seed Classes
INSERT INTO public.classes (name, description, instructor_id, duration, max_capacity, category, is_active)
SELECT
  name,
  description,
  (SELECT id FROM public.trainers WHERE user_id = '<YOUR-TRAINER-UID>'),  -- ← GANTI INI!
  duration,
  max_capacity,
  category,
  is_active
FROM (VALUES
  ('Morning Yoga Flow', 'Start your day with energizing yoga flows', 60, 25, 'yoga', true),
  ('Pilates Core', 'Strengthen your core and improve posture', 45, 20, 'pilates', true),
  ('HIIT Cardio Blast', 'Maximum calorie burn with HIIT', 45, 25, 'cardio', true),
  ('Indoor Cycling', 'Intense cycling workout with music', 50, 30, 'cycling', true),
  ('CrossFit Foundations', 'Learn CrossFit fundamentals', 60, 15, 'crossfit', true),
  ('Strength & Power', 'Build muscle with compound movements', 75, 12, 'strength', true),
  ('Boxing Bootcamp', 'High-intensity boxing workout', 60, 20, 'boxing', true),
  ('Power Yoga', 'Dynamic yoga for strength', 60, 22, 'yoga', true),
  ('Total Body Cardio', 'Full body cardio workout', 45, 25, 'cardio', true),
  ('Restorative Yoga', 'Relaxation and recovery yoga', 60, 20, 'yoga', true),
  ('Cardio Boxing', 'Boxing cardio for endurance', 60, 20, 'boxing', true),
  ('Full Body Strength', 'Complete strength training', 60, 18, 'strength', true)
) AS classes(name, description, duration, max_capacity, category, is_active);

-- 4. Seed Equipment
INSERT INTO public.equipment (name, category, status, purchase_date, last_maintenance) VALUES
-- Cardio
('Treadmill 01', 'cardio', 'available', '2024-01-15', '2024-12-01'),
('Treadmill 02', 'cardio', 'available', '2024-01-15', '2024-12-01'),
('Elliptical Trainer', 'cardio', 'available', '2024-02-20', '2024-11-15'),
('Rowing Machine', 'cardio', 'available', '2024-03-10', '2024-12-20'),
('Stationary Bike 01', 'cardio', 'available', '2024-01-15', '2024-12-01'),
('Stationary Bike 02', 'cardio', 'available', '2024-01-15', '2024-12-01'),

-- Strength
('Leg Press Machine', 'strength', 'available', '2024-01-20', '2024-11-20'),
('Chest Press Machine', 'strength', 'available', '2024-01-20', '2024-11-20'),
('Lat Pulldown', 'strength', 'available', '2024-01-20', '2024-11-20'),
('Cable Crossover', 'strength', 'available', '2024-02-15', '2024-12-10'),
('Smith Machine', 'strength', 'available', '2024-03-01', '2024-12-15'),

-- Free Weights
('Dumbbells Set', 'free_weights', 'available', '2024-01-10', NULL),
('Barbell Olympic 01', 'free_weights', 'available', '2024-01-10', NULL),
('Kettlebells Set', 'free_weights', 'available', '2024-02-01', NULL),

-- Accessories
('Yoga Mats (50x)', 'accessories', 'available', '2024-01-05', NULL),
('Resistance Bands', 'accessories', 'available', '2024-01-15', NULL),
('Boxing Gloves (20x)', 'accessories', 'available', '2024-02-10', NULL),
('Jump Ropes (30x)', 'accessories', 'available', '2024-01-20', NULL),
('Foam Rollers (25x)', 'accessories', 'available', '2024-02-15', NULL);

-- Success!
SELECT
  '🎉 SEED SUCCESS!' as status,
  COUNT(*) as total_classes
FROM public.classes;

SELECT
  '✅ Equipment loaded!' as status,
  COUNT(*) as total_equipment
FROM public.equipment;
```

---

## 🔄 **Cara Pakai:**

### **Step-by-Step:**

1. **Copy SQL di atas**

2. **Find & Replace (Ctrl+H):**
   - Find: `<YOUR-TRAINER-UID>`
   - Replace: `<UID yang Anda copy dari Langkah 1>`
   - Replace All (3 kali)

3. **Paste di SQL Editor**

4. **RUN!**

5. **Verify:**
   - Table Editor → classes → harus ada 12 rows
   - Table Editor → equipment → harus ada 18 rows

---

## ✅ **Hasil Yang Didapat:**

- ✅ 1 Trainer user (`trainer@gymfit.com`)
- ✅ 12 Classes (berbagai kategori)
- ✅ 18 Equipment items
- ✅ Login credentials:
  - Email: `trainer@gymfit.com`
  - Password: `trainer123`

---

## 🚀 **Setelah Seed Berhasil:**

```bash
# 1. Test connection
node test-connection.js
# Output: ✅ Found 12 classes

# 2. Start dev
pnpm dev

# 3. Open browser
# http://localhost:3001

# 4. Login dengan:
# Email: trainer@gymfit.com
# Password: trainer123
```

---

## 💡 **Alternative: Skip Auth User Creation**

Jika tidak mau buat auth user manual, gunakan ini (allow NULL instructor):

```sql
-- Make instructor_id nullable
ALTER TABLE public.classes
ALTER COLUMN instructor_id DROP NOT NULL;

-- Then seed classes without instructor
INSERT INTO public.classes (name, description, instructor_id, duration, max_capacity, category, is_active)
VALUES
  ('Morning Yoga', 'Morning yoga session', NULL, 60, 25, 'yoga', true),
  ('HIIT Cardio', 'High intensity cardio', NULL, 45, 25, 'cardio', true),
  ('Strength Training', 'Build muscle', NULL, 60, 20, 'strength', true);

-- Seed equipment (same as above)
```

---

## 🎯 **Pilihan Anda:**

### **Option 1 (Recommended):**
- ✅ Buat 1 auth user
- ✅ Run SQL di atas (replace UID)
- ✅ Dapat data lengkap + login credentials

### **Option 2 (Quick & Dirty):**
- ✅ Allow NULL instructor
- ✅ Seed tanpa trainer
- ✅ Assign trainer nanti

---

**Saya rekomendasikan OPTION 1 - hanya butuh 1 auth user, mudah!** 😊

Copy SQL di atas, replace `<YOUR-TRAINER-UID>`, dan RUN! 🚀
