"use client";

import { useSyncExternalStore } from "react";
import { saveSoundEnabled, soundEnabled, subscribeToSound } from "@/lib/soundPreference";
import SoundSwitch from "./SoundSwitch";

/** The settings menu's sound switch. */
export default function SoundPreference() {
  const on = useSyncExternalStore(subscribeToSound, soundEnabled, () => true);
  return <SoundSwitch on={on} onToggle={() => saveSoundEnabled(!on)} className="text-sm text-amber" />;
}
