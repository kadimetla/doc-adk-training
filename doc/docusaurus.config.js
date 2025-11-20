const config = {
  title: 'ADK Training Docs',
  url: 'https://mauripsale.github.io',
  baseUrl: '/doc-adk-training/',
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'throw',
    markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themeConfig: {
    navbar: {
      title: 'ADK Training: From Zero to Hero',
      logo: {
        alt: 'ADK Training Logo',
        src: 'img/favicon.ico',
      },
      items: [
        {
          to: '/module01-intro-to-ai-agents/',
          label: 'Modules',
          position: 'left'
        },
        {
          href: 'https://github.com/mauripsale/doc-adk-training',
          label: 'GitHub',
          position: 'right',
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
          sidebarPath: './sidebars.js',
          path: '../training',
          routeBasePath: '/',
          include: ['**/*.md','**/*.mdx'],
          async sidebarItemsGenerator({defaultSidebarItemsGenerator, ...args}) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            
            // Recursive function to filter out 'lab-solution' items
            const filterSolutions = (items) => {
              return items.filter((item) => {
                // If it's a category, filter its children recursively
                if (item.type === 'category') {
                  item.items = filterSolutions(item.items);
                  // Keep the category only if it's not empty (optional, but good for clean menus)
                  return item.items.length > 0;
                }
                // If it's a doc, check if its ID is 'lab-solution'
                if (item.type === 'doc') {
                  return !item.id.endsWith('lab-solution');
                }
                return true;
              });
            };

            return filterSolutions(sidebarItems);
          },
        },
        blog: false,
      },
    ],
  ],
};

export default config;
