/**
 * Kuchipudi curriculum — the single source of truth for module names.
 * `kuchipudi_progress.modules_completed` stores these exact strings, so
 * admin marking and the student view must agree on the names.
 */
export const KUCHIPUDI_LEVELS = ["foundation", "intermediate", "advanced"] as const;

export type KuchipudiLevel = (typeof KUCHIPUDI_LEVELS)[number];

export const KUCHIPUDI_LEVEL_LABELS: Record<KuchipudiLevel, string> = {
  foundation: "Foundation",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const KUCHIPUDI_CURRICULUM: Record<KuchipudiLevel, string[]> = {
  foundation: ["Basics & Footwork", "Hand Gestures (Mudras)", "Jathis & Items"],
  intermediate: ["Nritta Combinations", "Abhinaya (Expressions)", "Shabdam"],
  advanced: ["Varnam", "Padams & Javalis", "Full Margam"],
};

export function isKuchipudiLevel(value: string): value is KuchipudiLevel {
  return (KUCHIPUDI_LEVELS as readonly string[]).includes(value);
}

export function isKnownModule(value: string): boolean {
  return Object.values(KUCHIPUDI_CURRICULUM).some((modules) => modules.includes(value));
}
