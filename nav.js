(function () {
  const SVG_ATTRS = 'xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

  const NAV_ITEMS = [
    {
      href: 'index.html',
      label: 'Welcome',
      svg: `<svg ${SVG_ATTRS}><polyline points="8,10 12,1 16,10"/><polyline points="5,14 12,6 19,14"/><polyline points="2,20 12,11 22,20"/><line x1="12" y1="20" x2="12" y2="23"/></svg>`,
    },
    {
      href: 'house.html',
      label: 'House',
      svg: `<svg ${SVG_ATTRS}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    },
    {
      href: 'food.html',
      label: 'Food',
      svg: `<svg ${SVG_ATTRS}><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path><path d="m2.1 21.8 6.4-6.3"></path><path d="m19 5-7 7"></path></svg>`,
    },
    {
      href: 'activities.html',
      label: 'Activities',
      svg: `<svg ${SVG_ATTRS}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    },
    {
      href: 'contact.html',
      label: 'Contact',
      svg: `<svg ${SVG_ATTRS}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    },
  ];

  // Determine the current page filename; fall back to 'index.html' for the root path
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  const navEl = document.getElementById('main-nav');
  if (!navEl) return;

  navEl.innerHTML = NAV_ITEMS.map(item => {
    const isCurrent = item.href === currentPage;
    return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''}>${item.svg}<span>${item.label}</span></a>`;
  }).join('');
})();
