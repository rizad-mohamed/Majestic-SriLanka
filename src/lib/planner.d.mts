export interface BriefValues { name: string; email: string; date: string; travellers: string; duration?: string; journey?: string; interests?: string[]; notes?: string; consent: boolean }
export function validateBrief(values: BriefValues, today?: string): Record<string, string>;
export function formatBrief(values: BriefValues): string;
export function createEmailLink(email: string, brief: string): string | null;
