export default {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // legge i contenuti dalla cartella training nella root del repo
          path: '../training',
          routeBasePath: '/',
          include: ['**/*.md','**/*.mdx'],
          // Ordina: readme -> lab -> lab-solution e rende il readme la pagina della categoria
          async sidebarItemsGenerator({ defaultSidebarItemsGenerator, ...args }) {
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
                    // ordina i figli
                    const children = visit(it.items);
                    // se esiste un doc readme nel gruppo, linka la categoria a quel doc
                    const readme = children.find(
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
                  return ka - kb;
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
