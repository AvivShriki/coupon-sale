const MAX_DIMENSION = 1400;
const QUALITY = 0.82;

export const MAX_IMAGES = 5;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * מקטין תמונה בצד הלקוח לפני השליחה: חוסך רוחב פס ומונע קבצים ענקיים.
 * כשתתווסף העלאה ל-Supabase Storage, אותה פונקציה תרוץ לפני ההעלאה.
 */
export async function resizeImage(file: File): Promise<string> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("אפשר להעלות קבצי JPG, PNG או WebP בלבד");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("הקובץ גדול מדי – עד 12MB");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("הדפדפן לא תומך בעיבוד תמונות");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", QUALITY);
}
