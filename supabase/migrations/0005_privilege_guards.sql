-- ניתן להריץ שוב בבטחה.
--
-- תיקון אבטחה: מדיניות העדכון מאפשרת למשתמש לעדכן את השורה שלו, אבל לא
-- הגבילה אילו עמודות. משמעות הדבר היא שמשתמש יכול היה להפוך את עצמו למנהל,
-- או לאשר את המודעה של עצמו ולעקוף את הבדיקה. RLS לא מגביל עמודות, ולכן
-- ההגנה נאכפת בטריגרים.

-- ── 1. אישור מודעה הופך לדגל נפרד מהסטטוס ──────────────────────────────
-- הסטטוס שייך למוכר (פעילה / מושהית / נמכרה), האישור שייך למנהל.
alter table listings add column if not exists approved boolean not null default false;

alter table listings alter column status set default 'active';

drop index if exists listings_pending_idx;
create index if not exists listings_unapproved_idx
  on listings (created_at desc)
  where approved = false;

-- מודעה גלויה לציבור רק אם אושרה וגם פעילה
drop policy if exists listings_read_public on listings;
create policy listings_read_public on listings for select
  using ((status = 'active' and approved) or seller_id = auth.uid() or is_admin());

-- ── 2. הגנה על שדות שרק מנהל רשאי לשנות ────────────────────────────────
create or replace function guard_listing_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    -- מודעה חדשה תמיד נכנסת לא מאושרת, גם אם נשלח אחרת
    new.approved := false;
    return new;
  end if;

  if new.approved is distinct from old.approved and not is_admin() then
    new.approved := old.approved;
  end if;

  -- בעלות על מודעה לא ניתנת להעברה
  new.seller_id := old.seller_id;
  -- מונה הצפיות מתעדכן רק דרך הטריגר של טבלת הצפיות
  if new.views is distinct from old.views and not is_admin() then
    new.views := old.views;
  end if;

  return new;
end;
$$;

drop trigger if exists listings_guard_insert on listings;
create trigger listings_guard_insert
  before insert on listings
  for each row execute function guard_listing_columns();

drop trigger if exists listings_guard_update on listings;
create trigger listings_guard_update
  before update on listings
  for each row execute function guard_listing_columns();

-- ── 3. הגנה על תפקיד המשתמש ────────────────────────────────────────────
create or replace function guard_profile_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not is_admin() then
    new.role := old.role;
  end if;
  if new.is_verified is distinct from old.is_verified and not is_admin() then
    new.is_verified := old.is_verified;
  end if;
  new.id := old.id;
  return new;
end;
$$;

drop trigger if exists profiles_guard_update on profiles;
create trigger profiles_guard_update
  before update on profiles
  for each row execute function guard_profile_columns();
