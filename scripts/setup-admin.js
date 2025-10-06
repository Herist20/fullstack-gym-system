#!/usr/bin/env node

/**
 * Setup Test Admin User
 *
 * This script automatically creates a test admin user with full permissions.
 * Requires: @supabase/supabase-js
 *
 * Usage: node scripts/setup-admin.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const TEST_ADMIN = {
  email: 'admin@test.com',
  password: 'Admin123!',
  fullName: 'Admin Test User',
  phone: '+6281234567890'
};

const TEST_TRAINER = {
  email: 'trainer@test.com',
  password: 'Trainer123!',
  fullName: 'Trainer Test User',
  phone: '+6281234567891'
};

const TEST_MEMBER = {
  email: 'member@test.com',
  password: 'Member123!',
  fullName: 'Member Test User',
  phone: '+6281234567892'
};

async function createTestUser(userData, role, isStaff = false) {
  console.log(`\n📝 Creating ${role.toUpperCase()} user: ${userData.email}...`);

  try {
    // Step 1: Create auth user
    console.log('  → Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.fullName
      }
    });

    if (authError) {
      // User might already exist
      if (authError.message.includes('already registered')) {
        console.log('  ⚠️  User already exists in auth, fetching existing user...');

        // Get existing user
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) throw listError;

        const existingUser = users.users.find(u => u.email === userData.email);

        if (!existingUser) {
          throw new Error('User exists but could not be found');
        }

        console.log(`  ✅ Found existing user: ${existingUser.id}`);

        // Use existing user
        authData.user = existingUser;
      } else {
        throw authError;
      }
    } else {
      console.log(`  ✅ Auth user created: ${authData.user.id}`);
    }

    const userId = authData.user.id;

    // Step 2: Insert/Update in users table
    console.log('  → Inserting into users table...');
    const userRecord = {
      id: userId,
      email: userData.email,
      role: role,
      full_name: userData.fullName
    };

    // Add phone only if provided
    if (userData.phone) {
      userRecord.phone = userData.phone;
    }

    const { error: usersError } = await supabase
      .from('users')
      .upsert(userRecord, {
        onConflict: 'id'
      });

    if (usersError) throw usersError;
    console.log('  ✅ User profile created');

    // Step 3: If admin or trainer, add to admin_users table
    if (isStaff) {
      console.log('  → Adding to admin_users table...');

      const permissions = role === 'admin' ? {
        manage_users: true,
        manage_classes: true,
        manage_payments: true,
        manage_bookings: true,
        manage_trainers: true,
        manage_settings: true,
        view_analytics: true,
        manage_equipment: true
      } : {
        manage_classes: true,
        view_bookings: true,
        view_members: true
      };

      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert({
          user_id: userId,
          role: role,
          is_active: true,
          permissions: permissions
        }, {
          onConflict: 'user_id'
        });

      if (adminError) throw adminError;
      console.log('  ✅ Admin access granted');
    }

    // Step 4: If trainer, also add to trainers table
    if (role === 'trainer') {
      console.log('  → Adding to trainers table...');

      const { error: trainerError } = await supabase
        .from('trainers')
        .upsert({
          user_id: userId,
          specialization: ['Yoga', 'HIIT', 'Strength Training'],
          bio: 'Expert fitness trainer with 5+ years of experience in various training methods.',
          years_experience: 5,
          rating: 4.8
        }, {
          onConflict: 'user_id'
        });

      if (trainerError) throw trainerError;
      console.log('  ✅ Trainer profile created');
    }

    console.log(`✅ ${role.toUpperCase()} user setup complete!`);
    return { success: true, userId };

  } catch (error) {
    console.error(`❌ Error creating ${role} user:`, error.message);
    return { success: false, error };
  }
}

async function verifySetup() {
  console.log('\n🔍 Verifying setup...\n');

  try {
    // Check admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select(`
        role,
        is_active,
        user:users(email, full_name, role)
      `)
      .eq('is_active', true);

    if (adminError) throw adminError;

    console.log('📊 Active Admin/Staff Users:');
    console.log('─────────────────────────────────────────');

    if (adminUsers.length === 0) {
      console.log('  No admin users found');
    } else {
      adminUsers.forEach(admin => {
        console.log(`  ${admin.user.email}`);
        console.log(`    Role: ${admin.role}`);
        console.log(`    Name: ${admin.user.full_name}`);
        console.log(`    Active: ${admin.is_active}`);
        console.log('');
      });
    }

    // Check all users
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('email, full_name, role')
      .order('created_at', { ascending: false })
      .limit(10);

    if (usersError) throw usersError;

    console.log('📊 Recent Users:');
    console.log('─────────────────────────────────────────');
    allUsers.forEach(user => {
      console.log(`  ${user.email} - ${user.role} (${user.full_name})`);
    });

    return true;
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Gym System - Test Users Setup');
  console.log('═══════════════════════════════════════════\n');
  console.log('This will create test users for development:\n');
  console.log('  1. Admin User  - Full access to admin dashboard');
  console.log('  2. Trainer User - Access to trainer features');
  console.log('  3. Member User - Regular gym member\n');
  console.log('═══════════════════════════════════════════');

  // Create admin user
  const adminResult = await createTestUser(TEST_ADMIN, 'admin', true);

  // Create trainer user
  const trainerResult = await createTestUser(TEST_TRAINER, 'trainer', true);

  // Create member user
  const memberResult = await createTestUser(TEST_MEMBER, 'member', false);

  // Verify setup
  await verifySetup();

  // Print credentials
  console.log('\n═══════════════════════════════════════════');
  console.log('📋 TEST CREDENTIALS');
  console.log('═══════════════════════════════════════════\n');

  if (adminResult.success) {
    console.log('🔐 ADMIN ACCESS');
    console.log('   URL: http://localhost:3003');
    console.log(`   Email: ${TEST_ADMIN.email}`);
    console.log(`   Password: ${TEST_ADMIN.password}\n`);
  }

  if (trainerResult.success) {
    console.log('🔐 TRAINER ACCESS');
    console.log('   URL: http://localhost:3003');
    console.log(`   Email: ${TEST_TRAINER.email}`);
    console.log(`   Password: ${TEST_TRAINER.password}\n`);
  }

  if (memberResult.success) {
    console.log('🔐 MEMBER ACCESS');
    console.log('   URL: http://localhost:3001');
    console.log(`   Email: ${TEST_MEMBER.email}`);
    console.log(`   Password: ${TEST_MEMBER.password}\n`);
  }

  console.log('═══════════════════════════════════════════');
  console.log('✅ Setup Complete!\n');
  console.log('Next steps:');
  console.log('  1. Open http://localhost:3003');
  console.log('  2. Login with admin credentials above');
  console.log('  3. Start testing the admin dashboard!\n');
}

main().catch(console.error);
