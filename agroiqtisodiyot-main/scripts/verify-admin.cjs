const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://phrbxwdztnizcrfcesos.supabase.co';
const supabaseKey = 'sb_publishable_WnoQuguHTUmlJcpZE2ihWg_gKsVq7bd';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("🔄 admin@gmail.com orqali Supabase'ga kirish tekshirilmoqda...");
  
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@gmail.com',
      password: 'Admin1234'
    });

    if (authError) {
      console.error("❌ Kirish amalga oshmadi (Login failed):", authError.message);
      return;
    }

    console.log("✅ Tizimga muvaffaqiyatli kirildi! Foydalanuvchi ID:", authData.user.id);

    // Fetch journals instead of profiles to see if the table exists
    const { data: journals, error: journalsError } = await supabase
      .from('journals')
      .select('*')
      .limit(1);

    if (journalsError) {
      console.error("❌ Journals jadvalini o'qishda xatolik:", journalsError.message);
      return;
    }

    console.log("📋 Jurnallar jadvali bor. Ma'lumotlar:", journals);

  } catch (err) {
    console.error("Kutilmagan xatolik yuz berdi:", err);
  }
}

verify();
