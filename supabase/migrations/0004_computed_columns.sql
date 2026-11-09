-- ניתן להריץ שוב בבטחה.
-- עמודות מחושבות שמאפשרות לסנן ולמיין במסד הנתונים במקום בדפדפן.

-- אחוז ההנחה: משמש גם לאזור ההזדמנויות וגם למיון לפי ההנחה הגבוהה ביותר
alter table listings
  add column if not exists discount_percent int
  generated always as (
    case
      when original_price is not null and original_price > price
        then round(((original_price - price) / original_price) * 100)::int
      else null
    end
  ) stored;

create index if not exists listings_discount_idx
  on listings (discount_percent desc nulls last)
  where status = 'active';

-- התאריך שרלוונטי לסינון: תאריך האירוע, ואם אין — מועד התפוגה
alter table listings
  add column if not exists relevant_date timestamptz
  generated always as (coalesce(event_date, expires_at)) stored;

create index if not exists listings_relevant_date_idx
  on listings (relevant_date)
  where status = 'active';
