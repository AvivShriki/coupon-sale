"use client";

import { useEffect, useRef } from "react";
import { registerViewAction } from "@/app/listing/[id]/actions";

/** סופר צפייה פעם אחת לכל טעינת עמוד, ולא בכל רינדור מחדש של השרת */
export function ViewTracker({ listingId }: { listingId: string }) {
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    void registerViewAction(listingId);
  }, [listingId]);

  return null;
}
