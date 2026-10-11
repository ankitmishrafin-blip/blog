import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const tagsField = z.array(z.string()).default([]);
const draftField = z.boolean().default(false);

// Optional date field that tolerates the "empty" values Sveltia CMS writes when
// the editor leaves an optional date untouched. Sveltia/Decap serialise an empty
// `datetime` widget as an empty string (`updatedDate: ''`), YAML produces `null`
// for a bare key, and an empty object can also appear. `z.coerce.date()` turns
// each of those into an *Invalid Date* (or, for `null`, the 1970 epoch), which
// crashes the build with `updatedDate: Expected type "date"`. We normalise those
// empty representations to `undefined` BEFORE validation, then still run
// `z.coerce.date()` so genuine dates are parsed AND validated — a real
// non-date string is still rejected. Validation is not weakened.
const optionalDate = z.preprocess(
  (val) => {
    if (val === null || val === undefined || val === '') return undefined;
    if (typeof val === 'object' && !(val instanceof Date) && Object.keys(val).length === 0) {
      return undefined;
    }
    return val;
  },
  z.coerce.date().optional(),
);

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
      updatedDate: optionalDate,
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
    updatedDate: optionalDate,
    tags: tagsField,
    draft: draftField,
  }),
});

export const collections = { posts, notes };
