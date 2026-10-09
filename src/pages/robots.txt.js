import { withBase } from '../utils/paths';

export function GET({ site }) {
  const sitemapUrl = new URL(withBase('/sitemap-index.xml'), site).toString();

  return new Response(
    `User-agent: *\nAllow: /\n\n# Private CMS interface — keep out of search results.\nDisallow: /admin\n\nSitemap: ${sitemapUrl}\n`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
}
