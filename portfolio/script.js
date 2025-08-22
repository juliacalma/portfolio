// Smooth scroll that accounts for fixed navbar height
(function () {
  const header = document.querySelector('.navbar');


  function getHeaderHeight() {
    return header ? header.offsetHeight : 0;
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      e.preventDefault();

      const target = document.querySelector(id);
      if (!target) return;

      const offset = target.getBoundingClientRect().top + window.pageYOffset;
      const top = offset - getHeaderHeight() - 12; // small buffer
      window.scrollTo({ top, behavior: 'smooth' });

      // Active link UI
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });

  });// Highlight the active nav link based on current page

  const links = document.querySelectorAll('.nav-links a');
  let file = window.location.pathname.split('/').pop();
  if (file === '' || file === '/') file = 'index.html'; // treat root as home

  links.forEach(a => {
    const hrefFile = a.getAttribute('href').split('/').pop();
    if (hrefFile === file) a.classList.add('active');
  });
})();
