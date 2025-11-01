const config = {
  title: 'ADK Training Docs',
  url: 'https://mauripsale.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'throw',
    markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themeConfig: {
    navbar: {
      title: 'ADK Training Docs',
      logo: {
        alt: 'ADK Training Docs Logo',
        src: 'img/favicon.ico',
      },
      items: [
        {
          to: '/module01-intro-to-ai-agents/',
          label: 'Modules',
          position: 'left'
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../training',
          routeBasePath: '/',
          include: ['**/*.md','**/*.mdx'],
          async sidebarItemsGenerator({ defaultSidebarItemsGenerator, ...args }) {
            const items = await defaultSidebarItemsGenerator(args);
            const order = (id) => {
              const x = id?.toLowerCase?.() ?? '';
              if (x.endsWith('/readme')) return 1;
              if (x.endsWith('/lab')) return 2;
              if (x.endsWith('/lab-solution')) return 3;
              return Number.POSITIVE_INFINITY;
            };
            const visit = (list) =>
              list
                .map((it) => {
                  if (it.type === 'category' && Array.isArray(it.items)) {
                    const children = visit(it.items);
                    const readme = children.find(
                      (c) => c.type === 'doc' && c.id && c.id.toLowerCase().endsWith('/readme')
                    );
                    const link = readme ? { type: 'doc', id: readme.id } : (children.length > 0 ? { type: 'doc', id: children[0].id } : null);
                    return { ...it, items: children, link };
                  }
                  return it;
                })
                .sort((a, b) => {
                  const ka = a.type === 'doc' && a.id ? order(a.id) : Number.POSITIVE_INFINITY;
                  const kb = b.type === 'doc' && b.id ? order(b.id) : Number.POSITIVE_INFINITY;
                  return ka - kb;
                });
            return visit(items);
          },
        },
        blog: false,
      },
    ],
  ],
};

export default config;
