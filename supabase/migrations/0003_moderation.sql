-- מודעה חדשה ממתינה לאישור מנהל לפני שהיא מופיעה באתר.
-- מדיניות הקריאה הציבורית כבר מסננת לפי status = 'active',
-- ולכן מספיק לשנות את ברירת המחדל.
alter table listings alter column status set default 'pending_review';

-- אינדקס לתור האישורים בפאנל הניהול
create index if not exists listings_pending_idx
  on listings (created_at desc)
  where status = 'pending_review';
