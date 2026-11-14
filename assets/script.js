const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress span');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollUI(){
  const y = window.scrollY || document.documentElement.scrollTop;
  if(header) header.classList.toggle('scrolled', y > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if(progress) progress.style.width = `${max > 0 ? Math.min(100,(y/max)*100) : 0}%`;
}
updateScrollUI();
window.addEventListener('scroll', updateScrollUI, {passive:true});

if(toggle && nav){
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded','false');
    nav.classList.remove('open');
  }));
}

if(!reduceMotion && 'IntersectionObserver' in window){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -4% 0px'});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}else{
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

const notebook = document.querySelector('.field-notebook');
if(notebook && !reduceMotion && window.matchMedia('(pointer:fine)').matches){
  window.addEventListener('pointermove', event => {
    const x = (event.clientX / window.innerWidth - .5) * 5;
    const y = (event.clientY / window.innerHeight - .5) * 5;
    notebook.style.setProperty('--notebook-x', `${x}px`);
    notebook.style.setProperty('--notebook-y', `${y}px`);
  }, {passive:true});
}

const form = document.querySelector('#contact-form');
if(form){
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const organization = String(data.get('organization') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`OPERON inquiry${organization ? ` — ${organization}` : ''}`);
    const body = encodeURIComponent(`Name: ${name}\nWork email: ${email}\nOrganization: ${organization || 'Not provided'}\n\nBusiness challenge:\n${message}`);
    window.location.href = `mailto:hello@operonfinance.com?subject=${subject}&body=${body}`;
  });
}

const year = document.querySelector('#year');
if(year) year.textContent = new Date().getFullYear();
