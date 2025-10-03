// Test Supabase Connection
// Run: node test-connection.js

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split(/\r?\n/).forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  }
});

console.log('🔍 Testing Supabase Connection...\n');

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing environment variables!');
  console.error('   Check .env.local file');
  console.error('   Found vars:', Object.keys(envVars));
  process.exit(1);
}

console.log('📡 Supabase URL:', supabaseUrl);
console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Test 1: Check if we can query (should work even if no tables yet)
    const { data, error } = await supabase
      .from('classes')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('⚠️  Connection OK, but tables not created yet');
        console.log('   Please apply migrations via Supabase Dashboard');
        console.log('   See: NEXT_STEPS.md\n');
        return;
      }
      throw error;
    }

    console.log('✅ Connection successful!');
    console.log('✅ Database tables exist!');

    // Test 2: Try to count classes
    const { count } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true });

    if (count !== null) {
      console.log(`✅ Found ${count} classes in database`);

      if (count === 0) {
        console.log('\n💡 Tip: Load sample data by running seed.sql');
        console.log('   See: NEXT_STEPS.md Step 2');
      } else {
        console.log('✅ Sample data loaded!');
      }
    }

    console.log('\n🎉 Everything looks good!');
    console.log('   Ready to run: pnpm dev\n');

  } catch (err) {
    console.error('❌ Connection failed!');
    console.error('   Error:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check .env.local has correct credentials');
    console.log('   2. Apply migrations via Supabase Dashboard');
    console.log('   3. See: NEXT_STEPS.md\n');
    process.exit(1);
  }
}

testConnection();
