-- Coupon Sale – סכמה ראשונית
-- מבנה הטבלאות תואם ל-src/lib/data/types.ts, כדי שמימוש lib/data/supabase
-- יוכל להחליף את מימוש הדמה בלי לגעת ברכיבי הממשק.

create extension if not exists "pgcrypto";

-- ───────────────────────────── טיפוסים ─────────────────────────────
create type listing_status as enum (
  'active', 'paused', 'sold', 'expired', 'pending_review', 'removed'
);

create type contact_method as enum ('whatsapp', 'phone', 'email');

create type user_role as enum ('user', 'admin');

-- ───────────────────────────── פרופילים ─────────────────────────────
create table profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text        not null check (char_length(display_name) between 2 and 60),
  email         text        not null,
  phone         text,
  city          text,
  avatar_url    text,
  role          user_role   not null default 'user',
  is_verified   boolean     not null default false,
  created_at    timestamptz not null default now()
);

-- יצירת פרופיל אוטומטית בעת הרשמה
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- בדיקת הרשאת ניהול, משמשת בכל מדיניות שדורשת מנהל
create function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ───────────────────────────── קטגוריות ─────────────────────────────
create table categories (
  id         uuid primary key default gen_random_uuid(),
  parent_id  uuid references categories (id) on delete cascade,
  slug       text    not null,
  name       text    not null,
  icon       text    not null default 'tag',
  position   int     not null default 0,
  -- מסלול מלא (entertainment/concerts) – משמש ככתובת הקטגוריה באתר
  path       text    not null unique,
  created_at timestamptz not null default now(),
  unique (parent_id, slug)
);

create index categories_parent_idx on categories (parent_id, position);

-- ───────────────────────────── מודעות ─────────────────────────────
create table listings (
  id                 uuid primary key default gen_random_uuid(),
  seller_id          uuid not null references profiles (id) on delete cascade,
  category_id        uuid not null references categories (id) on delete restrict,
  title              text not null check (char_length(title) between 6 and 80),
  description        text not null check (char_length(description) between 20 and 4000),
  price              numeric(10, 2) not null check (price > 0),
  original_price     numeric(10, 2) check (original_price is null or original_price >= price),
  location           text,
  event_date         timestamptz,
  expires_at         timestamptz,
  quantity           int not null default 1 check (quantity between 1 and 50),
  -- שדות ייחודיים לקטגוריה (ראו src/lib/categories/category-fields.ts)
  attributes         jsonb not null default '{}'::jsonb,
  status             listing_status not null default 'active',
  views              int not null default 0,
  contact_whatsapp   text not null,
  contact_phone      text,
  contact_email      text,
  contact_preferred  contact_method not null default 'whatsapp',
  transfer_confirmed boolean not null default false check (transfer_confirmed),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index listings_feed_idx     on listings (status, created_at desc);
create index listings_category_idx on listings (category_id, status);
create index listings_seller_idx   on listings (seller_id, status);
create index listings_price_idx    on listings (price) where status = 'active';
create index listings_location_idx on listings (location) where status = 'active';
create index listings_attrs_idx    on listings using gin (attributes);
-- חיפוש טקסט חופשי בעברית (simple – אין מילון עברי מובנה ב-Postgres)
create index listings_search_idx   on listings
  using gin (to_tsvector('simple', title || ' ' || description || ' ' || coalesce(location, '')));

create function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_touch_updated_at
  before update on listings
  for each row execute function touch_updated_at();

-- ───────────────────────────── תמונות ─────────────────────────────
create table listing_images (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings (id) on delete cascade,
  url        text not null,
  alt        text not null default '',
  position   int  not null default 0,
  created_at timestamptz not null default now()
);

create index listing_images_listing_idx on listing_images (listing_id, position);

-- ───────────────────────────── מועדפים ─────────────────────────────
create table favorites (
  user_id    uuid not null references profiles (id) on delete cascade,
  listing_id uuid not null references listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- ───────────────────────────── דיווחים ─────────────────────────────
create table reports (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings (id) on delete cascade,
  reporter_id uuid references profiles (id) on delete set null,
  reason      text not null,
  details     text,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index reports_open_idx on reports (handled, created_at desc);

-- ───────────────────────────── צפיות ─────────────────────────────
create table listing_views (
  id           bigserial primary key,
  listing_id   uuid not null references listings (id) on delete cascade,
  viewer_hash  text,
  viewed_at    timestamptz not null default now()
);

create index listing_views_listing_idx on listing_views (listing_id, viewed_at desc);

create function bump_listing_views() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update listings set views = views + 1 where id = new.listing_id;
  return new;
end;
$$;

create trigger listing_views_bump
  after insert on listing_views
  for each row execute function bump_listing_views();

-- מודעות שפג תוקפן – להרצה מתוזמנת (pg_cron)
create function expire_listings() returns void
language sql security definer set search_path = public as $$
  update listings
     set status = 'expired'
   where status = 'active'
     and expires_at is not null
     and expires_at < now();
$$;

-- ───────────────────────────── Row Level Security ─────────────────────────────
alter table profiles       enable row level security;
alter table categories     enable row level security;
alter table listings       enable row level security;
alter table listing_images enable row level security;
alter table favorites      enable row level security;
alter table reports        enable row level security;
alter table listing_views  enable row level security;

-- פרופילים: קריאה פתוחה (שם המוכר מוצג במודעה), עדכון רק לעצמי
create policy profiles_read   on profiles for select using (true);
create policy profiles_update on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- קטגוריות: קריאה פתוחה, ניהול למנהל בלבד
create policy categories_read   on categories for select using (true);
create policy categories_manage on categories for all    using (is_admin()) with check (is_admin());

-- מודעות: הציבור רואה מודעות פעילות; המוכר רואה ומנהל את שלו; מנהל רואה הכל
create policy listings_read_public on listings for select
  using (status = 'active' or seller_id = auth.uid() or is_admin());

create policy listings_insert_own on listings for insert
  with check (auth.uid() = seller_id);

create policy listings_update_own on listings for update
  using (auth.uid() = seller_id or is_admin())
  with check (auth.uid() = seller_id or is_admin());

create policy listings_delete_own on listings for delete
  using (auth.uid() = seller_id or is_admin());

-- תמונות: נגזרות מהרשאות המודעה
create policy listing_images_read on listing_images for select
  using (exists (
    select 1 from listings l
     where l.id = listing_id
       and (l.status = 'active' or l.seller_id = auth.uid() or is_admin())
  ));

create policy listing_images_write on listing_images for all
  using (exists (
    select 1 from listings l where l.id = listing_id and (l.seller_id = auth.uid() or is_admin())
  ))
  with check (exists (
    select 1 from listings l where l.id = listing_id and (l.seller_id = auth.uid() or is_admin())
  ));

-- מועדפים: פרטיים למשתמש
create policy favorites_own on favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- דיווחים: כל אחד יכול לדווח, רק מנהל קורא ומטפל
create policy reports_insert on reports for insert with check (true);
create policy reports_admin  on reports for select using (is_admin());
create policy reports_handle on reports for update using (is_admin()) with check (is_admin());

-- צפיות: כל אחד מדווח צפייה, הנתונים הגולמיים למוכר ולמנהל
create policy listing_views_insert on listing_views for insert with check (true);
create policy listing_views_read   on listing_views for select
  using (exists (
    select 1 from listings l where l.id = listing_id and (l.seller_id = auth.uid() or is_admin())
  ));

-- ───────────────────────────── Storage ─────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "listing images are public"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- כל משתמש כותב רק לתיקייה שנושאת את המזהה שלו
create policy "users upload own listing images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users delete own listing images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
