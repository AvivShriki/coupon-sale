"use client";

import { useEffect, useRef } from "react";
import { registerView } from "@/lib/data/local";

/** סופר צפייה פעם אחת לכל טעינת עמוד */
export function ViewTracker({ listingId }: { listingId: string }) {
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    registerView(listingId);
  }, [listingId]);

  return null;
}
