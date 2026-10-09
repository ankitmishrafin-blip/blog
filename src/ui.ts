const ui = {
  backLink: '← All Posts',
  readingTime: (n: number) => `${n} min read`,
  updated: 'Updated',
  relatedPosts: 'Related',
  allPosts: 'All Posts →',
  postsEyebrow: 'Archive',
  postsTitle: 'All Posts',
  heroTitle: 'Ankit Mishra',
  heroTitleLine2: '',
  viewAll: 'All Posts →',
  readLink: 'Read →',
  notesEyebrow: 'Notes',
  notesTitle: 'Notes',
  notesLead: "Short-form writing: quick observations, half-formed ideas, and things worth jotting down.",
  notesViewAll: 'All notes →',
  tagsTitle: 'Topics',
  tagsLead: 'Browse writing by topic.',
  archiveTitle: 'Archive',
  archiveLead: 'Everything, in reverse chronological order.',
  projectsTitle: 'Projects',
  projectsEyebrow: 'Projects',
  postFeed: {
    all: 'All',
    filterLabel: 'Filter posts by category',
    previousCategories: 'Scroll categories left',
    nextCategories: 'Scroll categories right',
    searchLabel: 'Search posts',
    empty: 'No posts match this filter.',
    more: 'Load more',
    read: 'Read',
  },
};

export function getUiText() {
  return ui;
}
