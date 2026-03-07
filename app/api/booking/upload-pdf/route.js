import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const BUCKET = 'payment-pdfs';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Файл не выбран' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Файл не более 10 МБ' }, { status: 400 });
    }
    const type = file.type?.toLowerCase() || '';
    if (type !== 'application/pdf' && !file.name?.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Только PDF' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Загрузка не настроена (SUPABASE_SERVICE_ROLE_KEY)' },
        { status: 503 }
      );
    }

    const ext = file.name?.toLowerCase().endsWith('.pdf') ? '.pdf' : '.pdf';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

    const buf = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buf, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      if (error.message?.includes('Bucket not found')) {
        return NextResponse.json(
          { error: 'Создайте в Supabase Storage бакет «payment-pdfs» (публичный)' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
