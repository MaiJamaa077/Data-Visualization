import * as d3 from 'd3';

// Configuration
const config = {
    heatmap: {
        width: 600,
        height: 600,
        margin: { top: 60, right: 30, bottom: 150, left: 140 }
    },
    scatter: {
        width: 600,
        height: 600,
        margin: { top: 140, right: 30, bottom: 60, left: 60 }
    },
    colors: {
        male: "#f39c12",   // Inclusive Orange
        female: "#8e44ad", // Inclusive Purple
        active: "#006189",
        bg: "#fcfcfc"
    },
    transitionDuration: 750 // For gradual transitions
};

// Global State
let globalData = [];
let filteredData = [];
let currentFilters = {
    sport: null,
    team: null,
    gender: 'All',
    medal: 'All'
};

// Load Data
d3.csv('./data/athlete_events.csv', d3.autoType).then(data => {
    globalData = data.filter(d => d.Season === 'Winter');
    filteredData = [...globalData];
    initDashboard();
});

function initDashboard() {
    renderHeatmap();
    renderScatterPlot();
}

/**
 * NORMALIZATION: Count unique medals per Event/Team/Year 
 * to avoid team-sport bias (e.g. Hockey vs Skiing)
 */
function getNormalizedMedalCount(data, sport, team) {
    const subset = data.filter(d => 
        d.Sport === sport && 
        d.Team === team && 
        d.Medal && d.Medal !== 'NA'
    );
    // Group by Event and Year to count unique medals
    const uniqueMedals = d3.groups(subset, d => d.Event, d => d.Year);
    return uniqueMedals.length; 
}

/**
 * HEATMAP: Sport Dominance by Team
 */
function renderHeatmap() {
    const { width, height, margin } = config.heatmap;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#heatmap").attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const sportCounts = d3.rollup(globalData, v => v.length, d => d.Sport);
    const topSports = Array.from(sportCounts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(d => d[0]);
    
    const teamCounts = d3.rollup(globalData, v => v.length, d => d.Team);
    const topTeams = Array.from(teamCounts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(d => d[0]);

    const matrix = [];
    topSports.forEach(sport => {
        topTeams.forEach(team => {
            const count = getNormalizedMedalCount(globalData, sport, team);
            matrix.push({ sport, team, count });
        });
    });

    const x = d3.scaleBand().domain(topTeams).range([0, innerWidth]).padding(0.08);
    const y = d3.scaleBand().domain(topSports).range([0, innerHeight]).padding(0.08);
    const color = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(matrix, d => d.count)]);

    const cells = g.selectAll(".cell")
        .data(matrix).enter().append("rect")
        .attr("class", d => `cell ${currentFilters.team === d.team && currentFilters.sport === d.sport ? 'selected' : ''}`)
        .attr("x", d => x(d.team)).attr("y", d => y(d.sport))
        .attr("width", x.bandwidth()).attr("height", y.bandwidth())
        .attr("fill", d => d.count === 0 ? "#f0f0f0" : color(d.count))
        .on("mouseover", (event, d) => {
            showTooltip(event, `<span class="tooltip-title">${d.team}</span><b>Sport:</b> ${d.sport}<br/><b>Normalized Medals:</b> ${d.count}<br/><small>(Counts unique event wins)</small>`);
        })
        .on("mouseout", hideTooltip)
        .on("click", (event, d) => handleHeatmapClick(d));

    // Transition for selection feedback
    cells.transition().duration(200).style("opacity", 1);

    g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x))
        .selectAll("text").attr("transform", "rotate(-45)").attr("text-anchor", "end");
    g.append("g").call(d3.axisLeft(y));
}

/**
 * SCATTER PLOT: Height vs Weight with Transitions
 */
function renderScatterPlot() {
    const { width, height, margin } = config.scatter;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#scatter-plot").attr("viewBox", `0 0 ${width} ${height}`);
    
    // We only remove elements if they don't exist yet, to allow transitions
    if (svg.select("g.main-group").empty()) {
        svg.selectAll("*").remove();
        const g = svg.append("g").attr("class", "main-group").attr("transform", `translate(${margin.left},${margin.top})`);
        g.append("g").attr("class", "dots-group");
        g.append("g").attr("class", "x-axis").attr("transform", `translate(0,${innerHeight})`);
        g.append("g").attr("class", "y-axis");
        g.append("text").attr("class", "axis-label").attr("x", innerWidth/2).attr("y", innerHeight + 45).attr("text-anchor", "middle").text("Height (cm)");
        g.append("text").attr("class", "axis-label").attr("transform", "rotate(-90)").attr("x", -innerHeight/2).attr("y", -45).attr("text-anchor", "middle").text("Weight (kg)");
        renderInternalControls(svg);
    }

    const g = svg.select("g.main-group");
    const plotData = filteredData.filter(d => d.Height && d.Weight);
    const x = d3.scaleLinear().domain([135, 215]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([35, 145]).range([innerHeight, 0]);

    // Update Axes
    g.select(".x-axis").transition().duration(config.transitionDuration).call(d3.axisBottom(x));
    g.select(".y-axis").transition().duration(config.transitionDuration).call(d3.axisLeft(y));

    // Data Join for dots
    const dots = g.select(".dots-group").selectAll(".dot").data(plotData, d => d.ID);

    // Exit
    dots.exit().transition().duration(config.transitionDuration).style("opacity", 0).remove();

    // Enter + Update
    dots.enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.Height)).attr("cy", d => y(d.Weight))
        .attr("r", 0) // Start small for animation
        .attr("fill", d => d.Sex === 'M' ? config.colors.male : config.colors.female)
        .on("mouseover", (event, d) => {
            showTooltip(event, `<span class="tooltip-title">${d.Name}</span><b>Team:</b> ${d.Team}<br/><b>Sport:</b> ${d.Sport}<br/><b>H/W:</b> ${d.Height}cm / ${d.Weight}kg<br/><b>Medal:</b> ${d.Medal || 'None'}`);
        })
        .on("mouseout", hideTooltip)
      .merge(dots)
        .transition().duration(config.transitionDuration)
        .attr("cx", d => x(d.Height))
        .attr("cy", d => y(d.Weight))
        .attr("r", d => d.Medal && d.Medal !== 'NA' ? 6 : 3)
        .style("opacity", 0.6);
}

/**
 * INTERNAL CONTROLS: Interactive Legend Marks
 */
function renderInternalControls(svg) {
    const { margin, width } = config.scatter;
    const controlsG = svg.append("g").attr("transform", `translate(${margin.left}, 15)`);

    // Reset Button (Top Right Corner)
    const resetG = svg.append("g")
        .attr("class", "legend-item")
        .attr("transform", `translate(${width - 120}, 15)`)
        .on("click", () => {
            currentFilters = { sport: null, team: null, gender: 'All', medal: 'All' };
            applyFilters();
            renderHeatmap();
            renderInternalControls(svg); // Redraw to update active states
        });
    
    resetG.append("rect").attr("width", 90).attr("height", 35).attr("rx", 4).attr("fill", "#fff").attr("stroke", "#d40000").attr("stroke-width", 2);
    resetG.append("text").attr("x", 45).attr("y", 22).attr("text-anchor", "middle").attr("fill", "#d40000").attr("font-weight", "bold").attr("font-size", "12px").text("RESET ALL");

    // Gender Row
    const genderG = controlsG.append("g").attr("class", "legend-group");
    genderG.append("text").attr("y", 18).text("GENDER:").attr("font-weight", "700").attr("font-size", "11px");
    
    const genders = [
        { label: 'All', value: 'All', color: '#eee' },
        { label: 'Male', value: 'M', color: "#ffe0b2" },
        { label: 'Female', value: 'F', color: "#e1bee7" }
    ];

    const genderItems = genderG.selectAll(".legend-item")
        .data(genders).enter().append("g")
        .attr("class", d => `legend-item ${currentFilters.gender === d.value ? 'active' : ''}`)
        .attr("transform", (d, i) => `translate(${70 + i * 75}, 0)`)
        .on("click", (event, d) => {
            currentFilters.gender = d.value;
            applyFilters();
            renderInternalControls(svg); 
        });

    genderItems.append("rect").attr("width", 60).attr("height", 28).attr("rx", 4).attr("fill", d => d.color)
        .style("stroke", d => currentFilters.gender === d.value ? "#333" : "none").style("stroke-width", "2px");
    genderItems.append("text").attr("x", 30).attr("y", 18).attr("text-anchor", "middle").attr("fill", "#333").attr("font-weight", "600").text(d => d.label);

    // Medal Row
    const medalG = controlsG.append("g").attr("class", "legend-group").attr("transform", "translate(0, 45)");
    medalG.append("text").attr("y", 18).text("MEDAL:").attr("font-weight", "700").attr("font-size", "11px");

    const medals = [
        { label: 'All', color: '#eee' },
        { label: 'Gold', color: '#fff9c4' },
        { label: 'Silver', color: '#f5f5f5' },
        { label: 'Bronze', color: '#d7ccc8' }
    ];

    const medalItems = medalG.selectAll(".legend-item")
        .data(medals).enter().append("g")
        .attr("class", d => `legend-item ${currentFilters.medal === d.label ? 'active' : ''}`)
        .attr("transform", (d, i) => `translate(${70 + i * 75}, 0)`)
        .on("click", (event, d) => {
            currentFilters.medal = d.label;
            applyFilters();
            renderInternalControls(svg);
        });

    medalItems.append("rect").attr("width", 60).attr("height", 28).attr("rx", 4).attr("fill", d => d.color)
        .style("stroke", d => currentFilters.medal === d.label ? "#333" : "none").style("stroke-width", "2px");
    medalItems.append("text").attr("x", 30).attr("y", 18).attr("text-anchor", "middle").attr("fill", "#333").attr("font-weight", "600").text(d => d.label);
}

function applyFilters() {
    filteredData = globalData;
    if (currentFilters.sport) filteredData = filteredData.filter(d => d.Sport === currentFilters.sport);
    if (currentFilters.team) filteredData = filteredData.filter(d => d.Team === currentFilters.team);
    if (currentFilters.gender !== 'All') filteredData = filteredData.filter(d => d.Sex === currentFilters.gender);
    if (currentFilters.medal !== 'All') filteredData = filteredData.filter(d => d.Medal === currentFilters.medal);
    renderScatterPlot();
}

function handleHeatmapClick(d) {
    currentFilters.team = d.team;
    currentFilters.sport = d.sport;
    renderHeatmap(); 
    applyFilters();
}

// Tooltip setup
const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
function showTooltip(event, content) {
    tooltip.transition().duration(200).style("opacity", .9);
    tooltip.html(content).style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
}
function hideTooltip() { tooltip.transition().duration(500).style("opacity", 0); }
