/**
 * Helper utilities for parsing, formatting, and serializing
 * mandatory parent/guardian information for student profiles.
 */

export interface ParentInfo {
  parentName: string;
  parentPhone: string;
  parentRelationship: string;
  hasParentInfo: boolean;
}

/**
 * Extracts parent/guardian details from a student record, display_name payload,
 * or Supabase Auth user metadata.
 */
export function parseParentInfo(student: any, user?: any): ParentInfo {
  // 1. Direct columns if present on the student record
  if (student?.parent_name || student?.parentName) {
    const parentName = (student.parent_name || student.parentName || '').trim();
    const parentPhone = (student.parent_phone || student.parentPhone || '').trim();
    const parentRelationship = (student.parent_relationship || student.parentRelationship || 'Parent').trim();
    return {
      parentName,
      parentPhone,
      parentRelationship,
      hasParentInfo: Boolean(parentName && parentPhone),
    };
  }

  // 2. Parse from display_name (structured JSON or legacy formatted string)
  if (student?.display_name) {
    try {
      const parsed = JSON.parse(student.display_name);
      if (parsed && typeof parsed === 'object') {
        const parentName = (parsed.parent_name || parsed.parentName || '').trim();
        const parentPhone = (parsed.parent_phone || parsed.parentPhone || '').trim();
        const parentRelationship = (parsed.relationship || parsed.parentRelationship || 'Parent').trim();
        if (parentName) {
          return {
            parentName,
            parentPhone,
            parentRelationship,
            hasParentInfo: Boolean(parentName && parentPhone),
          };
        }
      }
    } catch {
      // Legacy string match: e.g. "Parent: Rajesh Sharma (Father) · 9876543210"
      const match = String(student.display_name).match(/Parent:\s*([^|(·\n]+)(?:\(([^)]+)\))?(?:\s*[|·]\s*([0-9+ ]+))?/i);
      if (match) {
        const parentName = (match[1] || '').trim();
        const parentRelationship = (match[2] || 'Parent').trim();
        const parentPhone = (match[3] || '').replace(/\D/g, '').slice(-10);
        return {
          parentName,
          parentPhone,
          parentRelationship,
          hasParentInfo: Boolean(parentName && parentPhone),
        };
      }
    }
  }

  // 3. Supabase Auth user metadata fallback
  if (user?.user_metadata) {
    const meta = user.user_metadata;
    const parentName = (meta.parent_name || meta.parentName || '').trim();
    const parentPhone = (meta.parent_phone || meta.parentPhone || '').trim();
    const parentRelationship = (meta.parent_relationship || meta.relationship || 'Parent').trim();
    if (parentName) {
      return {
        parentName,
        parentPhone,
        parentRelationship,
        hasParentInfo: Boolean(parentName && parentPhone),
      };
    }
  }

  return {
    parentName: '',
    parentPhone: '',
    parentRelationship: 'Parent',
    hasParentInfo: false,
  };
}

/**
 * Serializes parent info into a JSON payload for storage in display_name.
 */
export function serializeParentInfo(parentName: string, parentPhone: string, relationship?: string): string {
  return JSON.stringify({
    parent_name: parentName.trim(),
    parent_phone: parentPhone.trim(),
    relationship: (relationship || 'Parent').trim(),
    updated_at: new Date().toISOString(),
  });
}

export interface ProgrammeLike {
  slug?: string | null;
  name?: string | null;
  age_group?: string | null;
}

export interface BatchLike {
  name?: string | null;
}

/**
 * Returns true when the programme/batch is strictly an adult class (13+ years),
 * such as Adults Dance or Mind & Body Fitness (Yoga / Zumba).
 */
export function isAdultProgramme(
  programme?: ProgrammeLike | null,
  batch?: BatchLike | null,
): boolean {
  const slug = (programme?.slug || '').toLowerCase();
  const progName = (programme?.name || '').toLowerCase();
  const ageGroup = (programme?.age_group || '').toLowerCase();
  const batchName = (batch?.name || '').toLowerCase();

  if (batchName.includes('kid')) return false;

  if (
    slug === 'adults-dance' ||
    slug === 'mind-body-fitness' ||
    slug.includes('adult') ||
    progName.includes('adult') ||
    progName.includes('mind & body') ||
    progName.includes('zumba') ||
    progName.includes('yoga') ||
    batchName.includes('adult') ||
    batchName.includes('zumba') ||
    batchName.includes('yoga')
  ) {
    return true;
  }

  // Strictly "13+ Years" without kids
  if (ageGroup.includes('13+') && !ageGroup.includes('kid') && !ageGroup.includes('3.5')) {
    return true;
  }

  return false;
}

/**
 * Returns true when the programme/batch is strictly a kids' class,
 * where parent/guardian contact details are mandatory.
 */
export function isKidsProgramme(
  programme?: ProgrammeLike | null,
  batch?: BatchLike | null,
): boolean {
  if (isAdultProgramme(programme, batch)) return false;

  const slug = (programme?.slug || '').toLowerCase();
  const progName = (programme?.name || '').toLowerCase();
  const batchName = (batch?.name || '').toLowerCase();

  return (
    slug === 'kids-dance' ||
    slug === 'gymnastics' ||
    slug.includes('kid') ||
    progName.includes('kid') ||
    progName.includes('gymnastic') ||
    batchName.includes('kid')
  );
}
