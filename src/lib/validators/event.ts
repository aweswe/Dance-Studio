import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens'),
  startsAt: z.string().min(1, 'Date and time required'),
  venue: z.string().min(2, 'Venue is required'),
  description: z.string().min(10, 'Description is required'),
  isPublished: z.boolean(),
  imageUrl: z.string().optional().nullable(),
  images: z.array(z.string()).optional().default([]),
});

export type EventFormData = z.infer<typeof eventSchema>;

export function slugifyEventTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
