import { LetterGrade } from '@/types/agent';

/** Primary accent hex for a given letter grade. Used for borders, icons, rings, and fills. */
export const GRADE_HEX: Record<LetterGrade, string> = {
  'A+': '#10b981', // emerald-500
  'A':  '#10b981',
  'B+': '#3b82f6', // blue-500
  'B':  '#3b82f6',
  'C':  '#f59e0b', // amber-500
};

/**
 * Full-width hero gradient per grade.
 * A = vivid green → teal → cyan
 * B = vivid blue → indigo → violet
 * C = amber → orange → red
 */
export const GRADE_GRADIENT: Record<LetterGrade, string> = {
  'A+': 'linear-gradient(135deg, #059669 0%, #10b981 30%, #0d9488 65%, #0891b2 100%)',
  'A':  'linear-gradient(135deg, #059669 0%, #10b981 30%, #0d9488 65%, #0891b2 100%)',
  'B+': 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 35%, #6366f1 70%, #8b5cf6 100%)',
  'B':  'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 35%, #6366f1 70%, #8b5cf6 100%)',
  'C':  'linear-gradient(135deg, #d97706 0%, #f59e0b 40%, #ef4444 100%)',
};

export function gradeAccent(grade: LetterGrade): string {
  return GRADE_HEX[grade];
}

export function gradeGradient(grade: LetterGrade): string {
  return GRADE_GRADIENT[grade];
}
