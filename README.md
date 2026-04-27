# Crypto-MN Admin Setup

## 1. Package суулгах
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @tailwindcss/typography  # prose классуудад
```

## 2. .env.local файл үүсгэх
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 3. Supabase дээр SQL ажиллуулах
supabase/schema.sql файлыг Supabase > SQL Editor-т paste хийж Run дарна.

## 4. tailwind.config.js-д нэмэх
```js
plugins: [require('@tailwindcss/typography')],
```

## 5. Файлуудыг байрлуулах
```
/lib/supabase.ts              ← DB client
/components/NewsForm.tsx      ← Admin форм
/app/news/[slug]/page.tsx     ← Хэрэглэгч тал
/app/admin/news/new/page.tsx  ← Шинэ мэдээ (доор)
/app/admin/news/[id]/page.tsx ← Засах (доор)
```

## 6. Admin route үүсгэх
```tsx
// app/admin/news/new/page.tsx
import NewsForm from '@/components/NewsForm'
export default function NewNewsPage() {
  return <NewsForm />
}

// app/admin/news/[id]/page.tsx
import NewsForm from '@/components/NewsForm'
import { supabase } from '@/lib/supabase'
export default async function EditNewsPage({ params }) {
  const { data } = await supabase
    .from('news').select('*').eq('id', params.id).single()
  return <NewsForm existing={data} />
}
```

## Урсгал
1. Admin /admin/news/new → мэдээ бичнэ → "Нийтлэх" дарна
2. Supabase-д хадгалагдана (published: true)
3. Хэрэглэгч /news/[slug] руу орохоор Supabase-аас татаж харуулна
