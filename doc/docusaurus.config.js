export default {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // Read content from the 'training' directory in the repo root
          path: '../training',
          routeBasePath: '/',
          include: ['**/*.md','**/*.mdx'],
          // Sort order: readme -> lab -> lab-solution, and make the readme the category index page          async sidebarItemsGenerator({ defaultSidebarItemsGenerator, ...args }) {
            const items = await defaultSidebarItemsGenerator(args);
            const order = (id) => {
              const x = id.toLowerCase();
              if (x.endsWith('/readme')) return 1;
              if (x.endsWith('/lab')) return 2;
              if (x.endsWith('/lab-solution')) return 3;
              return Number.POSITIVE_INFINITY;
            };
            const visit = (list) =>
              list
                .map((it) => {
                  if (it.type === 'category' && Array.isArray(it.items)) {
                    // sort children
                    const children = visit(it.items);
                    // if a 'readme' doc exists in the group, link the category to that doc                    const readme = children.find(
                      (c) => c.type === 'doc' && c.id && c.id.toLowerCase().endsWith('/readme')
                    );
                    const link = readme ? { type: 'doc', id: readme.id } : it.link;
                    return { ...it, items: children, link };
                  }
                  return it;
                })
                .sort((a, b) => {
                  const ka = a.type === 'doc' && a.id ? order(a.id) : Number.POSITIVE_INFINITY;
                  const kb = b.type === 'doc' && b.id ? order(b.id) : Number.POSITIVE_INFINITY;
                  if (ka < kb) return -1;
                  if (ka > kb) return 1;

                  // Fallback to alphabetical sort for stability when order is the same.
                  const labelA = a.label || '';
                  const labelB = b.label || '';
                  return labelA.localeCompare(labelB);
                });
            return visit(items);
          },
          onBrokenLinks: 'throw',
          onBrokenMarkdownLinks: 'warn',
        },
        blog: false,
      },
    ],
  ],
};
