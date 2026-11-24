import { loadUserProfile, DEFAULT_USER_ID } from "@/lib/memory";
import { MyDnaDashboard } from "@/components/dna/MyDnaDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MY DNA — Personal Buying Memory | VERDICT",
  description:
    "Universal, user-controlled buying intelligence profile. Style DNA, registered assets, buying habits, and Don't-Buy protection.",
};

export default function DnaPage() {
  const profile = loadUserProfile(DEFAULT_USER_ID);

  return (
    <MyDnaDashboard
      initialMemories={profile.memories}
      initialSettings={profile.settings}
      initialItems={profile.ownedItems}
      initialDecisions={profile.decisions}
    />
  );
}
