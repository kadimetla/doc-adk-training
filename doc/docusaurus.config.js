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
        },
        blog: false,
      },
    ],
  ],
};

export default config;
