import type { Seller } from "@/lib/data/types";

/** המשתמש שמחובר במצב דמה. בשלב Supabase יוחלף ב-auth.user() */
export const DEMO_USER_ID = "u-me";

export const sellers: Seller[] = [
  { id: DEMO_USER_ID, displayName: "אביב שריקי", avatarUrl: null, memberSince: "2025-02-11", city: "תל אביב", isVerified: true },
  { id: "u-dana", displayName: "דנה לוי", avatarUrl: null, memberSince: "2024-08-03", city: "תל אביב", isVerified: true },
  { id: "u-yoav", displayName: "יואב מזרחי", avatarUrl: null, memberSince: "2025-01-19", city: "חיפה", isVerified: false },
  { id: "u-michal", displayName: "מיכל ברק", avatarUrl: null, memberSince: "2023-11-27", city: "ראשון לציון", isVerified: true },
  { id: "u-uri", displayName: "אורי כהן", avatarUrl: null, memberSince: "2025-05-06", city: "ירושלים", isVerified: false },
  { id: "u-noa", displayName: "נועה שמש", avatarUrl: null, memberSince: "2024-03-14", city: "רמת גן", isVerified: true },
  { id: "u-itay", displayName: "איתי פרץ", avatarUrl: null, memberSince: "2025-07-22", city: "באר שבע", isVerified: false },
  { id: "u-shira", displayName: "שירה אדרי", avatarUrl: null, memberSince: "2024-12-02", city: "נתניה", isVerified: true },
];
