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
  : "/portfolio/";         // GitHub Pages repo name

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

    const normalize = p => p.replace(/index\.html$/, '');
    if (a.host === location.host && normalize(a.pathname) === normalize(location.pathname)) {
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

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

// export function renderProjects(project, containerElement) {
//     containerElement.innerHTML = '';
//     for (const project of projects) {
//         const article = document.createElement('article');
//         article.innerHTML = `
//             <h3>${project.title}</h3>
//             <img src="${project.image}" alt="${project.title}">
//             <p>${project.description}</p>
//         `;
//         containerElement.appendChild(article);
//     }
// }

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    const validLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validLevels.includes(headingLevel)) {
        headingLevel = 'h2';
    }

    for (const project of projects) {
        const article = document.createElement('article');
        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
        `;
        containerElement.appendChild(article);
    }
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}