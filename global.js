console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
// );
// currentLink?.classList.add('current');
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/website/";         // GitHub Pages repo name

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'cv.html', title: 'Resume'},
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/hellogoodbye2007', title: 'GitHub'}
];
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let title = p.title;
    //nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    if (a.host !== location.host) {
        a.target = '_blank';
    }
}

let isDark = matchMedia("(prefers-color-scheme: dark)").matches
let autoLabel = `Automatic (${isDark ? 'Dark' : 'Light'})`;
document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
              <option value = 'light dark'>${autoLabel}</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
          </select>
      </label>`,
);

let select = document.querySelector('.color-scheme select');
if('colorScheme' in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme
}
select.addEventListener('input', function (event) {
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    select.value = event.target.value
    localStorage.colorScheme = event.target.value
});