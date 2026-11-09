-- ניתן להריץ שוב בבטחה.

-- 1. מודעה חדשה ממתינה לאישור מנהל לפני שהיא מופיעה באתר.
--    מדיניות הקריאה הציבורית כבר מסננת לפי status = 'active'.
alter table listings alter column status set default 'pending_review';

create index if not exists listings_pending_idx
  on listings (created_at desc)
  where status = 'pending_review';

-- 2. עמודת חיפוש מחושבת — מאחדת את כל השדות שגולש מחפש בהם,
--    כדי שחיפוש חופשי ירוץ על אינדקס ולא יסרוק את כל הטבלה.
create extension if not exists pg_trgm;

alter table listings
  add column if not exists search_text text
  generated always as (
    lower(
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(location, '') || ' ' ||
      coalesce(attributes::text, '')
    )
  ) stored;

create index if not exists listings_search_text_idx
  on listings using gin (search_text gin_trgm_ops);
