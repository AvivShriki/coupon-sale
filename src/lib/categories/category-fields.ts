/**
 * שדות נוספים לפי קטגוריה. נשמרים ב-listings.attributes (JSONB).
 * אשף הפרסום ועמוד המודעה מרנדרים את זה אוטומטית — אין טופס נפרד לכל קטגוריה.
 */
export type CategoryFieldType = "text" | "number" | "date" | "select";

export interface CategoryField {
  key: string;
  label: string;
  type: CategoryFieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  /** יחידה שמוצגת אחרי הערך, למשל ₪ או "אורחים" */
  suffix?: string;
}

/** מפתח = slug של הקטגוריה הראשית */
const fieldsByRoot: Record<string, CategoryField[]> = {
  entertainment: [
    { key: "artist", label: "אמן / מופע", type: "text", required: true, placeholder: "למשל: עדן חסון" },
    { key: "venue", label: "מקום האירוע", type: "text", required: true, placeholder: "למשל: היכל מנורה, תל אביב" },
    { key: "tickets", label: "מספר כרטיסים", type: "number", required: true, suffix: "כרטיסים" },
    { key: "seats", label: "אזור / מושבים", type: "text", placeholder: "למשל: יציע 3, שורה ח" },
  ],
  vacations: [
    { key: "destination", label: "יעד", type: "text", required: true, placeholder: "למשל: רודוס, יוון" },
    { key: "hotel", label: "שם המלון / המקום", type: "text", placeholder: "למשל: Mitsis Grand" },
    { key: "checkIn", label: "תאריך כניסה", type: "date", required: true },
    { key: "checkOut", label: "תאריך יציאה", type: "date", required: true },
    { key: "guests", label: "מספר אורחים", type: "number", required: true, suffix: "אורחים" },
    { key: "board", label: "סוג אירוח", type: "select", options: ["ללא ארוחות", "ארוחת בוקר", "חצי פנסיון", "הכל כלול"] },
  ],
  attractions: [
    { key: "place", label: "מקום / אתר", type: "text", required: true, placeholder: "למשל: סופרלנד, ראשון לציון" },
    { key: "participants", label: "מספר משתתפים", type: "number", required: true, suffix: "משתתפים" },
    { key: "ageRange", label: "מתאים לגילאים", type: "text", placeholder: "למשל: 6+" },
  ],
  food: [
    { key: "venueName", label: "שם המסעדה / העסק", type: "text", required: true, placeholder: "למשל: מסעדת לומינה" },
    { key: "voucherValue", label: "שווי השובר", type: "number", suffix: "₪" },
    { key: "diners", label: "מספר סועדים", type: "number", suffix: "סועדים" },
    { key: "kosher", label: "כשרות", type: "select", options: ["כשר", "לא כשר", "לא ידוע"] },
  ],
  spa: [
    { key: "treatmentType", label: "סוג הטיפול", type: "text", required: true, placeholder: "למשל: עיסוי שוודי 60 דקות" },
    { key: "place", label: "מקום הטיפול", type: "text", required: true, placeholder: "למשל: ספא הכרמל, חיפה" },
    { key: "sessions", label: "מספר טיפולים שנותרו", type: "number", required: true, suffix: "טיפולים" },
    { key: "forWho", label: "מתאים ל", type: "select", options: ["יחיד", "זוג", "קבוצה"] },
  ],
  digital: [
    { key: "provider", label: "ספק השירות", type: "text", required: true, placeholder: "למשל: Adobe" },
    { key: "planName", label: "שם המנוי / החבילה", type: "text", placeholder: "למשל: Creative Cloud שנתי" },
    { key: "remaining", label: "תקופה שנותרה", type: "text", required: true, placeholder: "למשל: 7 חודשים" },
    { key: "transferable", label: "אפשרות העברה", type: "select", required: true, options: ["ניתן להעברה מלאה", "העברה בתיאום עם הספק", "העברת חשבון בלבד"] },
  ],
  education: [
    { key: "institution", label: "מוסד / מעביר הקורס", type: "text", required: true, placeholder: "למשל: קמפוס IL" },
    { key: "format", label: "אופן הלמידה", type: "select", required: true, options: ["אונליין", "פרונטלי", "היברידי"] },
    { key: "hours", label: "היקף שעות", type: "number", suffix: "שעות" },
    { key: "startDate", label: "מועד תחילה", type: "date" },
  ],
  "special-events": [
    { key: "eventName", label: "שם האירוע", type: "text", required: true, placeholder: "למשל: פסטיבל אבו גוש" },
    { key: "venue", label: "מקום האירוע", type: "text", required: true },
    { key: "tickets", label: "מספר כרטיסים", type: "number", required: true, suffix: "כרטיסים" },
  ],
  vouchers: [
    { key: "brand", label: "רשת / חנות", type: "text", required: true, placeholder: "למשל: קסטרו" },
    { key: "voucherValue", label: "שווי השובר", type: "number", required: true, suffix: "₪" },
    { key: "redeemMethod", label: "אופן המימוש", type: "select", required: true, options: ["בחנות", "באינטרנט", "בחנות ובאינטרנט"] },
    { key: "partialUse", label: "מימוש חלקי", type: "select", options: ["אפשרי", "לא אפשרי", "לא ידוע"] },
  ],
  sports: [
    { key: "eventName", label: "משחק / פעילות", type: "text", required: true, placeholder: "למשל: מכבי ת\"א – הפועל ב\"ש" },
    { key: "venue", label: "מקום", type: "text", required: true },
    { key: "tickets", label: "מספר כרטיסים", type: "number", required: true, suffix: "כרטיסים" },
    { key: "seats", label: "אזור / מושבים", type: "text" },
  ],
  benefits: [
    { key: "provider", label: "גוף מעניק ההטבה", type: "text", required: true },
    { key: "benefitType", label: "סוג ההטבה", type: "text", required: true },
    { key: "transferTerms", label: "תנאי העברה", type: "text", placeholder: "למשל: נדרש עדכון שם במועדון" },
  ],
};

export function fieldsForRoot(rootSlug: string | undefined): CategoryField[] {
  if (!rootSlug) return [];
  return fieldsByRoot[rootSlug] ?? [];
}
