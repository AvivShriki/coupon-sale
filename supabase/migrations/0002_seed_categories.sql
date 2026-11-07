-- נוצר אוטומטית מ-src/data/seed/categories.json – אין לערוך ידנית

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'entertainment', 'הופעות ובידור', 'music', 0, 'entertainment')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'entertainment'), 'concerts', 'כרטיסי הופעות', 'music', 0, 'entertainment/concerts')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'entertainment'), 'standup', 'סטנדאפ', 'music', 1, 'entertainment/standup')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'entertainment'), 'theater', 'הצגות', 'music', 2, 'entertainment/theater')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'entertainment'), 'musicals', 'מחזות זמר', 'music', 3, 'entertainment/musicals')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'entertainment'), 'festivals', 'פסטיבלים', 'music', 4, 'entertainment/festivals')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'entertainment'), 'parties', 'מסיבות', 'music', 5, 'entertainment/parties')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'entertainment'), 'live-music', 'מופעי מוזיקה', 'music', 6, 'entertainment/live-music')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'vacations', 'חופשות ואירוח', 'palm', 1, 'vacations')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vacations'), 'domestic', 'חופשות בארץ', 'palm', 0, 'vacations/domestic')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vacations'), 'abroad', 'חופשות בחו"ל', 'palm', 1, 'vacations/abroad')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vacations'), 'hotels', 'בתי מלון', 'palm', 2, 'vacations/hotels')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vacations'), 'cabins', 'צימרים ווילות', 'palm', 3, 'vacations/cabins')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vacations'), 'packages', 'חבילות נופש', 'palm', 4, 'vacations/packages')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vacations'), 'flights', 'טיסות שניתן להעביר', 'palm', 5, 'vacations/flights')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vacations'), 'hosting', 'חבילות אירוח', 'palm', 6, 'vacations/hosting')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'attractions', 'אטרקציות וחוויות', 'ferris-wheel', 2, 'attractions')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'attractions'), 'theme-parks', 'פארקי שעשועים', 'ferris-wheel', 0, 'attractions/theme-parks')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'attractions'), 'escape-rooms', 'חדרי בריחה', 'ferris-wheel', 1, 'attractions/escape-rooms')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'attractions'), 'tours', 'טיולים וסיורים', 'ferris-wheel', 2, 'attractions/tours')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'attractions'), 'kids', 'אטרקציות לילדים', 'ferris-wheel', 3, 'attractions/kids')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'attractions'), 'extreme', 'פעילויות אקסטרים', 'ferris-wheel', 4, 'attractions/extreme')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'attractions'), 'cruises', 'שייט', 'ferris-wheel', 5, 'attractions/cruises')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'attractions'), 'couples', 'חוויות זוגיות', 'ferris-wheel', 6, 'attractions/couples')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'food', 'אוכל וקולינריה', 'utensils', 3, 'food')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'food'), 'chef-dinners', 'ארוחות שף', 'utensils', 0, 'food/chef-dinners')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'food'), 'cooking-workshops', 'סדנאות בישול', 'utensils', 1, 'food/cooking-workshops')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'food'), 'wine-tasting', 'טעימות יין', 'utensils', 2, 'food/wine-tasting')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'food'), 'food-tours', 'סיורי אוכל', 'utensils', 3, 'food/food-tours')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'food'), 'restaurant-vouchers', 'שוברים למסעדות', 'utensils', 4, 'food/restaurant-vouchers')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'food'), 'meal-packages', 'ארוחות וחבילות אירוח', 'utensils', 5, 'food/meal-packages')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'spa', 'ספא, בריאות וטיפוח', 'sparkles', 4, 'spa')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'spa'), 'massage', 'עיסויים', 'sparkles', 0, 'spa/massage')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'spa'), 'spa-packages', 'חבילות ספא', 'sparkles', 1, 'spa/spa-packages')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'spa'), 'facial', 'טיפולי פנים', 'sparkles', 2, 'spa/facial')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'spa'), 'beauty', 'טיפולי יופי', 'sparkles', 3, 'spa/beauty')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'spa'), 'body', 'טיפולי גוף', 'sparkles', 4, 'spa/body')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'spa'), 'treatment-packages', 'חבילות טיפולים', 'sparkles', 5, 'spa/treatment-packages')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'spa'), 'gym', 'מנויי מכוני כושר', 'sparkles', 6, 'spa/gym')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'spa'), 'studio-classes', 'שיעורי סטודיו', 'sparkles', 7, 'spa/studio-classes')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'digital', 'מנויים ושירותים דיגיטליים', 'monitor-play', 5, 'digital')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'digital'), 'content', 'מנויי תוכן', 'monitor-play', 0, 'digital/content')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'digital'), 'streaming', 'שירותי סטרימינג', 'monitor-play', 1, 'digital/streaming')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'digital'), 'software', 'מנויי תוכנות', 'monitor-play', 2, 'digital/software')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'digital'), 'cloud-storage', 'שירותי אחסון בענן', 'monitor-play', 3, 'digital/cloud-storage')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'digital'), 'learning-subscriptions', 'מנויי לימוד וקורסים', 'monitor-play', 4, 'digital/learning-subscriptions')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'digital'), 'digital-fitness', 'מנויי כושר דיגיטליים', 'monitor-play', 5, 'digital/digital-fitness')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'digital'), 'licenses', 'רישיונות תוכנה שניתן להעביר', 'monitor-play', 6, 'digital/licenses')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'education', 'לימודים והעשרה', 'graduation-cap', 6, 'education')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'education'), 'online-courses', 'קורסים דיגיטליים', 'graduation-cap', 0, 'education/online-courses')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'education'), 'languages', 'קורסי שפות', 'graduation-cap', 1, 'education/languages')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'education'), 'professional', 'קורסים מקצועיים', 'graduation-cap', 2, 'education/professional')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'education'), 'workshops', 'סדנאות', 'graduation-cap', 3, 'education/workshops')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'education'), 'conferences', 'כרטיסים לכנסים', 'graduation-cap', 4, 'education/conferences')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'education'), 'lectures', 'כרטיסים להרצאות', 'graduation-cap', 5, 'education/lectures')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'education'), 'pro-events', 'אירועים מקצועיים', 'graduation-cap', 6, 'education/pro-events')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'special-events', 'אירועים מיוחדים', 'party-popper', 7, 'special-events')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'special-events'), 'festival-tickets', 'כרטיסים לפסטיבלים', 'party-popper', 0, 'special-events/festival-tickets')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'special-events'), 'corporate', 'אירועי חברה', 'party-popper', 1, 'special-events/corporate')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'special-events'), 'party-tickets', 'כרטיסים למסיבות', 'party-popper', 2, 'special-events/party-tickets')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'special-events'), 'holidays', 'אירועי חגים', 'party-popper', 3, 'special-events/holidays')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'special-events'), 'tasting-events', 'אירועי טעימות', 'party-popper', 4, 'special-events/tasting-events')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'special-events'), 'vip', 'אירועי VIP', 'party-popper', 5, 'special-events/vip')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'special-events'), 'expos', 'כרטיסים לתערוכות', 'party-popper', 6, 'special-events/expos')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'vouchers', 'שוברים וזיכויים', 'gift', 8, 'vouchers')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vouchers'), 'store-credit', 'זיכויים מחנויות', 'gift', 0, 'vouchers/store-credit')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vouchers'), 'gift-cards', 'גיפט קארדים', 'gift', 1, 'vouchers/gift-cards')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vouchers'), 'fashion', 'שוברים לרשתות אופנה', 'gift', 2, 'vouchers/fashion')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vouchers'), 'electronics', 'שוברים למוצרי חשמל', 'gift', 3, 'vouchers/electronics')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vouchers'), 'cosmetics', 'שוברים לטיפוח', 'gift', 4, 'vouchers/cosmetics')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'vouchers'), 'general', 'שוברים כלליים', 'gift', 5, 'vouchers/general')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'sports', 'ספורט ופנאי', 'trophy', 9, 'sports')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'sports'), 'games', 'כרטיסים למשחקי ספורט', 'trophy', 0, 'sports/games')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'sports'), 'team-memberships', 'מנויים לקבוצות', 'trophy', 1, 'sports/team-memberships')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'sports'), 'courts', 'מגרשי ספורט', 'trophy', 2, 'sports/courts')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'sports'), 'padel', 'פאדל', 'trophy', 3, 'sports/padel')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'sports'), 'activities', 'פעילויות ספורט', 'trophy', 4, 'sports/activities')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values (null, 'benefits', 'שירותים והטבות', 'badge-percent', 10, 'benefits')
on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'benefits'), 'club', 'הטבות מועדון', 'badge-percent', 0, 'benefits/club')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'benefits'), 'service-packages', 'חבילות שירות', 'badge-percent', 1, 'benefits/service-packages')
on conflict (path) do update set name = excluded.name, position = excluded.position;

insert into categories (parent_id, slug, name, icon, position, path) values ((select id from categories where path = 'benefits'), 'transferable', 'זכויות שניתנות להעברה', 'badge-percent', 2, 'benefits/transferable')
on conflict (path) do update set name = excluded.name, position = excluded.position;
