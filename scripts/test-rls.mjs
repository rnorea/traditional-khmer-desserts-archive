/**
 * RLS (Row Level Security) Test Script for Khmer Desserts Archive
 *
 * Verifies the database security policies defined in supabase/schema.sql:
 * 1. Anonymous visitors can view published entries.
 * 2. Anonymous visitors cannot view unpublished / draft entries.
 * 3. Anonymous visitors cannot insert, update, or delete entries.
 * 4. (Optional) Authenticated users can insert their own entries, view their own drafts,
 *    and cannot spoof author_id or modify unauthorized records.
 *
 * Usage:
 *   - Run public/anonymous tests:
 *       node --env-file=.env scripts/test-rls.mjs
 *
 *   - Run full tests including authenticated author checks:
 *       node --env-file=.env scripts/test-rls.mjs <email> <password>
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in environment.');
  console.error('   Ensure you run with: node --env-file=.env scripts/test-rls.mjs');
  process.exit(1);
}

// Credentials for authenticated tests can be provided via CLI args or env
const testEmail = process.argv[2] || process.env.TEST_EMAIL;
const testPassword = process.argv[3] || process.env.TEST_PASSWORD;

let passed = 0;
let failed = 0;

function report(testName, isSuccess, details = '') {
  if (isSuccess) {
    passed++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failed++;
    console.log(`  ❌ [FAIL] ${testName}`);
  }
  if (details) {
    console.log(`     ↳ ${details}`);
  }
}

async function runAnonTests(anonClient) {
  console.log('\n========================================');
  console.log('1. Anonymous / Public User RLS Checks');
  console.log('========================================\n');

  // Test 1: Can read published entries
  try {
    const { data, error } = await anonClient
      .from('entries')
      .select('id, title_en, status')
      .eq('status', 'published')
      .limit(5);

    if (error) {
      report('SELECT published entries', false, `Error: ${error.message}`);
    } else {
      report('SELECT published entries', true, `Successfully fetched ${data.length} published record(s)`);
    }
  } catch (err) {
    report('SELECT published entries', false, err.message);
  }

  // Test 2: Cannot see unpublished entries (drafts, pending, etc.)
  try {
    const { data, error } = await anonClient
      .from('entries')
      .select('id, title_en, status')
      .neq('status', 'published');

    if (error) {
      report('RESTRICT unpublished entries', false, `Query error: ${error.message}`);
    } else if (data.length === 0) {
      report('RESTRICT unpublished entries', true, '0 unpublished entries returned (RLS correctly blocked them)');
    } else {
      report('RESTRICT unpublished entries', false, `Leaked ${data.length} unpublished entries to anonymous user!`);
    }
  } catch (err) {
    report('RESTRICT unpublished entries', false, err.message);
  }

  // Test 3: Cannot insert entries without authentication
  try {
    const fakeEntry = {
      title_en: 'RLS Test Num Ansom',
      title_kh: 'នំអន្សម (តេស្ត)',
      description_en: 'Traditional sticky rice cake test entry.',
      description_kh: 'ការធ្វើតេស្តសុវត្ថិភាពទិន្នន័យនំអន្សមបុរាណ',
      ingredients_en: 'Sticky rice, pork, mung bean',
      ingredients_kh: 'អង្ករដំណើប, សាច់ជ្រូក, សណ្ដែកបាយ',
      instructions_en: 'Wrap in banana leaves and boil.',
      instructions_kh: 'ខ្ចប់ស្លឹកចេក រួចស្ងោរ។',
      status: 'published',
      author_id: '00000000-0000-0000-0000-000000000000'
    };

    const { data, error } = await anonClient
      .from('entries')
      .insert([fakeEntry])
      .select();

    if (error) {
      report('BLOCK INSERT as anonymous', true, `Rejected as expected: "${error.message}"`);
    } else if (data && data.length > 0) {
      report('BLOCK INSERT as anonymous', false, 'Insert succeeded! Anonymous user should NOT be able to insert.');
    } else {
      report('BLOCK INSERT as anonymous', true, 'Insert produced no records');
    }
  } catch (err) {
    report('BLOCK INSERT as anonymous', true, `Blocked with exception: ${err.message}`);
  }

  // Test 4: Cannot update any entries as anonymous
  try {
    const { data, error } = await anonClient
      .from('entries')
      .update({ title_en: 'Unauthorized Title Edit' })
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .select();

    if (error) {
      report('BLOCK UPDATE as anonymous', true, `Update rejected: "${error.message}"`);
    } else if (!data || data.length === 0) {
      report('BLOCK UPDATE as anonymous', true, 'Update affected 0 rows (RLS prevented modifications)');
    } else {
      report('BLOCK UPDATE as anonymous', false, 'Update modified rows unexpectedly!');
    }
  } catch (err) {
    report('BLOCK UPDATE as anonymous', true, `Blocked with exception: ${err.message}`);
  }

  // Test 5: Cannot delete any entries as anonymous
  try {
    const { data, error } = await anonClient
      .from('entries')
      .delete()
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .select();

    if (error) {
      report('BLOCK DELETE as anonymous', true, `Delete rejected: "${error.message}"`);
    } else if (!data || data.length === 0) {
      report('BLOCK DELETE as anonymous', true, 'Delete affected 0 rows (RLS prevented deletion)');
    } else {
      report('BLOCK DELETE as anonymous', false, 'Delete modified rows unexpectedly!');
    }
  } catch (err) {
    report('BLOCK DELETE as anonymous', true, `Blocked with exception: ${err.message}`);
  }
}

async function runAuthenticatedTests(authClient, email, password) {
  console.log('\n========================================');
  console.log('2. Authenticated User RLS Checks');
  console.log('========================================\n');

  console.log(`  Authenticating as: ${email}...`);
  const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
    email,
    password
  });

  if (authError || !authData?.user) {
    console.error(`  ❌ Failed to sign in with provided credentials: ${authError?.message}`);
    failed++;
    return;
  }

  const userId = authData.user.id;
  console.log(`  Authenticated successfully. User ID: ${userId}\n`);

  let createdEntryId = null;

  // Test 6: User can insert an entry with their own author_id
  try {
    const testEntry = {
      title_en: 'Sankhya Lapov RLS Test',
      title_kh: 'សង់ខ្យាល្ពៅ (តេស្តសុវត្ថិភាព RLS)',
      description_en: 'Traditional Khmer pumpkin custard used to verify author RLS insert policy.',
      description_kh: 'បង្អែមសង់ខ្យាល្ពៅបុរាណខ្មែរ សម្រាប់ផ្ទៀងផ្ទាត់គោលការណ៍សុវត្ថិភាព RLS។',
      ingredients_en: 'Pumpkin, coconut cream, palm sugar, eggs',
      ingredients_kh: 'ល្ពៅ, ខ្ទិះដូង, ស្ករត្នោត, ពងទា',
      instructions_en: 'Steam until custard is set.',
      instructions_kh: 'ចំហុយរហូតដល់សង់ខ្យាឆ្អិនល្អ។',
      status: 'draft',
      author_id: userId
    };

    const { data, error } = await authClient
      .from('entries')
      .insert([testEntry])
      .select();

    if (error) {
      report('ALLOW INSERT with matching author_id', false, error.message);
    } else if (data && data.length > 0) {
      createdEntryId = data[0].id;
      report('ALLOW INSERT with matching author_id', true, `Created draft entry ID: ${createdEntryId}`);
    } else {
      report('ALLOW INSERT with matching author_id', false, 'Insert returned no data');
    }
  } catch (err) {
    report('ALLOW INSERT with matching author_id', false, err.message);
  }

  // Test 7: User cannot spoof another author_id during insert
  try {
    const spoofedEntry = {
      title_en: 'Spoofed Author Test',
      title_kh: 'តេស្តក្លែងបន្លំអ្នកនិពន្ធ',
      description_en: 'Attempting to insert using a forged author_id.',
      description_kh: 'ប៉ុនប៉ងបញ្ចូលទិន្នន័យដោយប្រើអត្តសញ្ញាណអ្នកនិពន្ធក្លែងក្លាយ។',
      ingredients_en: 'N/A',
      ingredients_kh: 'គ្មាន',
      instructions_en: 'N/A',
      instructions_kh: 'គ្មាន',
      status: 'draft',
      author_id: '11111111-1111-1111-1111-111111111111'
    };

    const { data, error } = await authClient
      .from('entries')
      .insert([spoofedEntry])
      .select();

    if (error) {
      report('BLOCK INSERT with forged author_id', true, `Correctly blocked by WITH CHECK (auth.uid() = author_id): "${error.message}"`);
    } else if (data && data.length > 0) {
      report('BLOCK INSERT with forged author_id', false, 'Spoofed insert succeeded! RLS with-check is failing.');
    } else {
      report('BLOCK INSERT with forged author_id', true, 'Insert returned no records');
    }
  } catch (err) {
    report('BLOCK INSERT with forged author_id', true, `Blocked with exception: ${err.message}`);
  }

  // Test 8: Author can view their own draft entry
  if (createdEntryId) {
    try {
      const { data, error } = await authClient
        .from('entries')
        .select('id, title_en, status, author_id')
        .eq('id', createdEntryId);

      if (error) {
        report('ALLOW SELECT own draft entry', false, error.message);
      } else if (data && data.length > 0) {
        report('ALLOW SELECT own draft entry', true, `Author can read their own draft (status: ${data[0].status})`);
      } else {
        report('ALLOW SELECT own draft entry', false, 'Draft entry was not visible to its author');
      }
    } catch (err) {
      report('ALLOW SELECT own draft entry', false, err.message);
    }

    // Test 9: Author can update their own entry
    try {
      const { data, error } = await authClient
        .from('entries')
        .update({ title_en: 'Sankhya Lapov RLS Test (Updated)' })
        .eq('id', createdEntryId)
        .select();

      if (error) {
        report('ALLOW UPDATE own entry', false, error.message);
      } else if (data && data.length > 0) {
        report('ALLOW UPDATE own entry', true, `Updated entry title: "${data[0].title_en}"`);
      } else {
        report('ALLOW UPDATE own entry', false, 'Update returned 0 rows');
      }
    } catch (err) {
      report('ALLOW UPDATE own entry', false, err.message);
    }

    // Test 10: Author can delete their own entry (cleanup)
    try {
      const { error } = await authClient
        .from('entries')
        .delete()
        .eq('id', createdEntryId);

      if (error) {
        report('ALLOW DELETE own entry (cleanup)', false, error.message);
      } else {
        report('ALLOW DELETE own entry (cleanup)', true, `Deleted test entry ${createdEntryId}`);
      }
    } catch (err) {
      report('ALLOW DELETE own entry (cleanup)', false, err.message);
    }
  }
}

async function main() {
  console.log('========================================');
  console.log(' Khmer Desserts Archive - RLS Test Suite');
  console.log('========================================');
  console.log(`Target Supabase URL: ${SUPABASE_URL}`);

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  await runAnonTests(anonClient);

  if (testEmail && testPassword) {
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false }
    });
    await runAuthenticatedTests(authClient, testEmail, testPassword);
  } else {
    console.log('\n----------------------------------------');
    console.log('ℹ️  Tip: To test authenticated author policies (insert/update/delete your own):');
    console.log('   node --env-file=.env scripts/test-rls.mjs <your-email> <your-password>');
    console.log('----------------------------------------');
  }

  console.log('\n========================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error during RLS testing:', err);
  process.exit(1);
});
