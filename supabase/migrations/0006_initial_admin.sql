-- ניתן להריץ שוב בבטחה.

-- ── 1. תיקון הטריגרים: לא לחסום גישה ישירה למסד הנתונים ────────────────
-- פנייה מהאתר תמיד נושאת משתמש מחובר. פנייה ישירה (עורך ה-SQL, מפתח
-- service_role) לא נושאת משתמש, והיא ממילא מורשית. בלי התנאי הזה גם
-- עדכון ידני שלך היה נחסם.
create or replace function guard_profile_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null then
    if new.role is distinct from old.role and not is_admin() then
      new.role := old.role;
    end if;
    if new.is_verified is distinct from old.is_verified and not is_admin() then
      new.is_verified := old.is_verified;
    end if;
  end if;
  new.id := old.id;
  return new;
end;
$$;

create or replace function guard_listing_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      new.approved := false;
    end if;
    return new;
  end if;

  if auth.uid() is not null then
    if new.approved is distinct from old.approved and not is_admin() then
      new.approved := old.approved;
    end if;
    if new.views is distinct from old.views and not is_admin() then
      new.views := old.views;
    end if;
  end if;

  new.seller_id := old.seller_id;
  return new;
end;
$$;

-- ── 2. מנהל ראשון ──────────────────────────────────────────────────────
-- עובד בין אם החשבון כבר קיים ובין אם ייפתח בהמשך.
create or replace function grant_initial_admin() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.email = 'avivshriki1@gmail.com' then
    new.role := 'admin';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_initial_admin on profiles;
create trigger profiles_initial_admin
  before insert on profiles
  for each row execute function grant_initial_admin();

update profiles set role = 'admin' where email = 'avivshriki1@gmail.com';
