-- ניתן להריץ שוב בבטחה.
--
-- העדכון הקודם לא נתפס: טריגר ההגנה החזיר את התפקיד לערכו הקודם.
-- כאן ההגנה מושבתת לרגע אחד בלבד, בתוך אותה הרצה, ומוחזרת מיד.

-- 1. גרסה מתוקנת של ההגנות: פנייה ישירה למסד הנתונים אינה נחסמת
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

-- 2. מנהל אוטומטי גם לחשבון שייפתח בעתיד עם הכתובת הזו
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

-- 3. הענקת ההרשאה לחשבון הקיים, בעקיפת ההגנה לרגע אחד
alter table profiles disable trigger profiles_guard_update;
update profiles set role = 'admin' where email = 'avivshriki1@gmail.com';
alter table profiles enable trigger profiles_guard_update;

-- 4. בדיקה: הטבלה שתוצג בסוף צריכה להראות admin ליד הכתובת שלך
select email, display_name, role from profiles order by created_at;
