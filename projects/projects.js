import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

// let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
// // let arc = arcGenerator({
// //     startAngle: 0,
// //     endAngle: 2 * Math.PI,
// //   });

// // d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');
// // let data = [1, 2];
// //let colors = ['gold', 'purple'];
// // let total = 0;
// //let data = [1, 2, 3, 4, 5, 5];
// // let data = [
// //     { value: 1, label: 'apples' },
// //     { value: 2, label: 'oranges' },
// //     { value: 3, label: 'mangos' },
// //     { value: 4, label: 'pears' },
// //     { value: 5, label: 'limes' },
// //     { value: 5, label: 'cherries' },
// //   ];
// //let sliceGenerator = d3.pie();
// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//   legend
//     .append('li')
//     .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//     .attr('class', 'legend-item')
//     .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// });

// // for (let d of data) {
// //   total += d;
// // }
// //let angle = 0;
// //let arcData = [];

// // for (let d of data) {
// //   let endAngle = angle + (d / total) * 2 * Math.PI;
// //   arcData.push({ startAngle: angle, endAngle });
// //   angle = endAngle;
// // }

// let arcs = arcData.map((d) => arcGenerator(d));
// //let arcs = arcData.map((d) => arcGenerator(d));
// arcs.forEach((arc, idx) => {
//     d3.select('svg').append('path').attr('d', arc).attr('fill', colors(idx));
//   });

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
    selectedIndex = -1;
    let svg = d3.select('svg');
    let legend = d3.select('.legend');
    svg.selectAll('path').remove();
    legend.selectAll('li').remove();

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    }).sort((a, b) => a.label - b.label);

    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let sliceGenerator = d3.pie().value((d) => d.value);

    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));

    function toggle(i) {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg.selectAll('path').classed('selected', (_, idx) => idx === selectedIndex);
        legend.selectAll('li').classed('selected', (_, idx) => idx === selectedIndex);

        if (selectedIndex === -1) {
            renderProjects(projects, projectsContainer, 'h2');
        } else {
            let year = data[selectedIndex].label;
            let yearProjects = projects.filter((p) => p.year === year);
            renderProjects(yearProjects, projectsContainer, 'h2');
        }
    }

    arcs.forEach((arc, idx) => {
        svg.append('path').attr('d', arc).attr('fill', colors(idx)).on('click', () => toggle(idx));
    });

    data.forEach((d, idx) => {
        legend
            .append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', () => toggle(idx));
    });
}

renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects)
});