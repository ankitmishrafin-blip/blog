import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const tagsField = z.array(z.string()).default([]);
const draftField = z.boolean().default(false);

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // `image()` enables build-time optimization for local images referenced
      // with a relative path. The `z.string()` branch is only for *absolute
      // remote* URLs (e.g. `https://…`), which Astro treats as remote images.
      // NOTE: root-relative served paths such as `/uploads/x.jpg` must NOT be
      // stored in this field — Astro's content pipeline treats them as image
      // assets and the build FAILS with ImageNotFound if the file is missing.
      // CMS uploads are therefore inserted in the Markdown body instead
      // (`![alt](/uploads/x.jpg)`), which renders as a plain <img> with no
      // build-time resolution (see `public/admin/config.yml`).
      heroImage: z.union([image(), z.string()]).optional(),
      focusEffect: z.literal('scroll-dark').optional(),
      category: z.string().optional(),
      tags: tagsField,
      homeFeatured: z.boolean().default(false),
      homeHeroOrder: z.number().int().positive().optional(),
      homeOrder: z.number().int().positive().optional(),
      draft: draftField,
    }),
});

const notes = defineCollection({
  // Short-form writing: Markdown and MDX files in `src/content/notes/`.
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: tagsField,
    draft: draftField,
  }),
});

export const collections = { posts, notes };
