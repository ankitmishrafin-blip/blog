import { getCollection, type CollectionEntry } from 'astro:content';

export type TaggedEntry = CollectionEntry<'posts'> | CollectionEntry<'notes'>;

/**
 * Collect tags with counts and the entries that carry them, across both the
 * `posts` and `notes` collections (drafts excluded). Sorted by count desc, then
 * alphabetically for stable output.
 */
export async function getTags() {
  const [posts, notes] = await Promise.all([getCollection('posts'), getCollection('notes')]);

  const live = [...posts, ...notes].filter((entry) => !entry.data.draft);

  const map = new Map<string, number>();
  for (const entry of live) {
    for (const tag of entry.data.tags ?? []) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }

  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Live entries (posts + notes) that carry a given tag. */
export async function getEntriesByTag(tag: string) {
  const [posts, notes] = await Promise.all([getCollection('posts'), getCollection('notes')]);

  const postIds = new Set(posts.map((p) => p.id));

  const live: Array<CollectionEntry<'posts'> | CollectionEntry<'notes'>> = [...posts, ...notes];

  return live
    .filter((entry) => !entry.data.draft && (entry.data.tags ?? []).includes(tag))
    .map((entry) => ({
      entry,
      isPost: postIds.has(entry.id),
      url: postIds.has(entry.id) ? `/posts/${entry.id}/` : `/notes/${entry.id}/`,
    }))
    .sort((a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf());
}
