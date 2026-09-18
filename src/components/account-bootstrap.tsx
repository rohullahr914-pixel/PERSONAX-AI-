"use client";

import { useEffect } from "react";
import { refreshCurrentUser } from "@/lib/auth";
import { clearProfilePreferences, refreshProfilePreferences } from "@/lib/profile";

export function AccountBootstrap() {
  useEffect(() => {
    let active = true;
    void refreshCurrentUser().then((user) => {
      if (!active) return;
      if (user) void refreshProfilePreferences(user.id);
      else clearProfilePreferences();
    });
    return () => { active = false; };
  }, []);
  return null;
}
