'use strict';

function xmlEscape(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeRootRelativeParentPaths(data) {
  return String(data || '')
    .replace(/(src|href)=("|')\/(?:\.\.\/)+/g, '$1=$2/')
    .replace(/(src|href)=&quot;\/(?:\.\.\/)+/g, '$1=&quot;/');
}

function absoluteUrl(value) {
  const rawValue = String(value || '').trim();

  if (!rawValue) return '';
  if (/^https?:\/\//i.test(rawValue)) return rawValue.replace(/\/index\.html$/, '/');

  const baseUrl = String(hexo.config.url || '').replace(/\/+$/, '');
  const root = String(hexo.config.root || '/');
  const baseWithRoot = `${baseUrl}${root.startsWith('/') ? root : `/${root}`}`.replace(/\/+$/, '/');

  return new URL(rawValue.replace(/^\/+/, ''), baseWithRoot).href.replace(/\/index\.html$/, '/');
}

function dateToIsoDate(value) {
  if (!value) return '';

  let dateValue = value;

  if (typeof value.toDate === 'function') dateValue = value.toDate();
  if (typeof dateValue.toISOString === 'function') return dateValue.toISOString().slice(0, 10);
  if (typeof value.toISOString === 'function') return value.toISOString().slice(0, 10);
  if (typeof value.toJSON === 'function') return String(value.toJSON()).slice(0, 10);

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10);
}

function newestDate(items) {
  return items.reduce((newest, item) => {
    const candidate = item.updated || item.date;
    const candidateTime = candidate && typeof candidate.valueOf === 'function'
      ? candidate.valueOf()
      : Date.parse(candidate);

    if (!candidateTime || Number.isNaN(candidateTime)) return newest;
    if (!newest || candidateTime > newest.value) return { value: candidateTime, date: candidate };

    return newest;
  }, null)?.date;
}

hexo.extend.generator.register('sitemap', locals => {
  const urls = new Map();
  const posts = locals.posts.sort('date', -1).toArray();
  const pages = locals.pages.toArray();
  const categories = locals.categories.toArray();
  const tags = locals.tags.toArray();

  function addUrl(value, options = {}) {
    const loc = absoluteUrl(value);

    if (!loc || urls.has(loc)) return;

    urls.set(loc, {
      loc,
      lastmod: dateToIsoDate(options.lastmod),
      changefreq: options.changefreq,
      priority: options.priority
    });
  }

  addUrl('/', {
    lastmod: newestDate(posts),
    changefreq: 'weekly',
    priority: '1.0'
  });

  posts.forEach(post => {
    addUrl(post.permalink || post.path, {
      lastmod: post.updated || post.date,
      changefreq: 'monthly',
      priority: '0.8'
    });
  });

  pages
    .filter(page => !/^404(?:\/|\.html?$)/i.test(page.path))
    .forEach(page => {
      addUrl(page.permalink || page.path, {
        lastmod: page.updated || page.date,
        changefreq: 'yearly',
        priority: page.path === 'about/index.html' ? '0.7' : '0.5'
      });
    });

  addUrl('archives/', {
    lastmod: newestDate(posts),
    changefreq: 'weekly',
    priority: '0.6'
  });

  categories.forEach(category => {
    addUrl(category.permalink || category.path, {
      lastmod: newestDate(category.posts ? category.posts.toArray() : posts),
      changefreq: 'weekly',
      priority: '0.5'
    });
  });

  tags.forEach(tag => {
    addUrl(tag.permalink || tag.path, {
      lastmod: newestDate(tag.posts ? tag.posts.toArray() : posts),
      changefreq: 'weekly',
      priority: '0.4'
    });
  });

  const body = Array.from(urls.values()).map(url => [
    '  <url>',
    `    <loc>${xmlEscape(url.loc)}</loc>`,
    url.lastmod ? `    <lastmod>${xmlEscape(url.lastmod)}</lastmod>` : '',
    url.changefreq ? `    <changefreq>${xmlEscape(url.changefreq)}</changefreq>` : '',
    url.priority ? `    <priority>${xmlEscape(url.priority)}</priority>` : '',
    '  </url>'
  ].filter(Boolean).join('\n')).join('\n');

  return {
    path: 'sitemap.xml',
    data: [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      body,
      '</urlset>'
    ].join('\n')
  };
});

hexo.extend.generator.register('robots', () => ({
  path: 'robots.txt',
  data: [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${absoluteUrl('sitemap.xml')}`,
    ''
  ].join('\n')
}));

hexo.extend.filter.register('after_post_render', data => {
  data.content = normalizeRootRelativeParentPaths(data.content);
  data.excerpt = normalizeRootRelativeParentPaths(data.excerpt);
  data.more = normalizeRootRelativeParentPaths(data.more);

  return data;
});

hexo.extend.filter.register('after_render:html', data => {
  return normalizeRootRelativeParentPaths(data);
});

hexo.extend.filter.register('after_render:xml', data => {
  return normalizeRootRelativeParentPaths(data);
});
