import { z } from "zod";

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  excerpt: z.string().max(500, "Excerpt is too long").optional(),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().max(500, "Cover URL is too long").optional().or(z.literal("")),
  metaDescription: z
    .string()
    .max(300, "Meta description is too long")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string().min(1)).max(10, "Too many tags").default([]),
  isPublished: z.boolean().default(false),
});

export type BlogPostData = z.infer<typeof blogPostSchema>;
