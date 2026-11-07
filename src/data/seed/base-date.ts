/**
 * תאריך הייחוס של נתוני הדמה. חייב להיות קבוע ולא Date.now(),
 * אחרת ה-HTML שנוצר בזמן הבנייה לא יתאים לרינדור בדפדפן (hydration mismatch).
 * בבנייה אוטומטית מזריקים את תאריך הבנייה, כך שהנתונים נשארים טריים.
 */
export const SEED_BASE = Date.parse(
  process.env.NEXT_PUBLIC_SEED_BASE ?? "2026-11-07T09:00:00.000Z",
);
