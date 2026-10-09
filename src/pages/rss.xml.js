import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_LANG, SITE_TITLE } from '../consts';
import { withBase } from '../utils/paths';

export async function GET(context) {
  const [posts, notes] = await Promise.all([getCollection('posts'), getCollection('notes')]);

  const postItems = posts
    .filter((p) => !p.data.draft)
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBase(`/posts/${post.id}/`),
    }));

  const noteItems = notes
    .filter((n) => !n.data.draft)
    .map((note) => ({
      title: note.data.title || 'Note',
      description: note.data.description ?? '',
      pubDate: note.data.pubDate,
      link: withBase(`/notes/${note.id}/`),
    }));

  const items = [...postItems, ...noteItems].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: new URL(withBase('/'), context.site),
    customData: `<language>${SITE_LANG}</language>`,
    items,
  });
}
