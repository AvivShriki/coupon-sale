import { mockDataSource } from "./mock";
import type { DataSource } from "./types";

/**
 * נקודת הכניסה היחידה לנתונים.
 * כל רכיב קורא `db.listListings(...)` ולא יודע אם מתחת יושב seed מקומי או Postgres.
 * בשלב חיבור Supabase מחליפים כאן את המימוש לפי DATA_SOURCE, בלי לגעת ב-UI.
 */
export const db: DataSource = mockDataSource;

export const isMockData = db === mockDataSource;
