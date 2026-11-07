import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
    const data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));
    
    return data;
}

// let data = await loadData();

// let commits = d3.groups(data, (d) => d.commit);

function processCommits(data) {
    return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
        // Each 'lines' array contains all lines modified in this commit
        // All lines in a commit have the same author, date, etc.
        // So we can get this information from the first line
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        
        // What information should we return about this commit?
        let ret = {
            id: commit,
            url: 'https://github.com/YOUR_REPO/commit/' + commit,
            author,
            date,
            time,
            timezone,
            datetime,
            hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
            totalLines: lines.length,
        };
        
        Object.defineProperty(ret, 'lines', {
            value: lines,
            configurable: true,
            writable: true,
            enumerable: false,
        });
        
        return ret
    });
}

function renderCommitInfo(data, commits) {
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
    
    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
    
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
    
    // Add more stats as needed...
    const fileLengths = d3.rollups(
        data,
        (v) => d3.max(v, (d) => +d.line),
        (d) => d.file,
    );
    const longestFile = d3.greatest(fileLengths, (d) => d[1]); // [fileName, lines]
    
    dl.append('dt').text('Longest file');
    dl.append('dd').text(longestFile[0]);
    
    dl.append('dt').text('Max file length (lines)');
    dl.append('dd').text(longestFile[1]);
    
    dl.append('dt').text('Longest line (characters)');
    dl.append('dd').text(d3.max(data, (d) => +d.length));
    
    dl.append('dt').text('Max depth');
    dl.append('dd').text(d3.max(data, (d) => +d.depth));
}


function renderScatterPlot(data, commits) {
    // Put all the JS code of Steps inside this function
}

let data = await loadData();
let commits = processCommits(data);

renderCommitInfo(data, commits);
renderScatterPlot(data, commits);