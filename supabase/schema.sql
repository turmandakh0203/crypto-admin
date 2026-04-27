-- ════════════════════════════════════════
-- Supabase дээр ажиллуулах SQL
-- ════════════════════════════════════════

-- 1. Мэдээний хүснэгт
create table if not exists news (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  slug        text unique not null,
  category    text,
  lead        text,
  content     text,
  image_url   text,
  tags        text[] default '{}',
  read_time   int default 5,
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Үзэлтийн хүснэгт
create table if not exists page_views (
  id          uuid default gen_random_uuid() primary key,
  page        text,
  viewed_at   timestamptz default now()
);

-- 3. Row Level Security
alter table news enable row level security;
alter table page_views enable row level security;

-- Хэрэглэгч нийтлэгдсэн мэдээг уншиж болно
create policy "Public read published"
  on news for select
  using (published = true);

-- Admin бүгдийг хийж болно (service role key ашиглана)
create policy "Admin all"
  on news for all
  using (auth.role() = 'service_role');

-- Үзэлт нэмэх
create policy "Anyone can insert view"
  on page_views for insert
  with check (true);

-- 4. Статистик view
create or replace view news_stats as
select
  n.id,
  n.title,
  n.slug,
  n.category,
  n.published,
  n.created_at,
  count(pv.id) as view_count
from news n
left join page_views pv on pv.page = n.id::text
group by n.id, n.title, n.slug, n.category, n.published, n.created_at
order by view_count desc;

-- 5. updated_at автоматаар шинэчлэх
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on news
  for each row execute function update_updated_at();
