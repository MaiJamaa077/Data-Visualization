import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';

// ============================================================================
// CONFIG
// ============================================================================
const WIDTH = 860;
const PC_H = 420, PS_H = 380, TS_H = 270;
const MARGIN = { top: 40, right: 60, bottom: 40, left: 60 };

const locationColors = d3.scaleOrdinal()
    .domain(['Coastal', 'Continental', 'Mountain'])
    .range(['#2196F3', '#FF9800', '#4CAF50']);

// ============================================================================
// GLOBAL STATE
// ============================================================================
let globalData = [];       // raw daily rows
let aggregatedData = [];   // weekly-aggregated rows
let filteredData = [];     // current filter result
let lowestTempItem = null; // from raw data (Guaranteed Visibility)

const state = {
    pcExtents: {},   // { dimName: [min, max] }
    psFilter: null,  // { category: 'Season'|'LocationType'|'STATION_NAME', value: string }
    tsBrush: null    // [Date, Date]
};

// ============================================================================
// DOM SETUP
// ============================================================================
const vis = d3.select('#visualization')
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .style('gap', '32px')
    .style('padding', '12px 0');

// Tooltip (shared)
const tooltip = d3.select('body').append('div')
    .style('position', 'fixed')
    .style('background', 'rgba(0,0,0,0.78)')
    .style('color', '#fff')
    .style('padding', '7px 12px')
    .style('border-radius', '6px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('z-index', 999);

function showTooltip(event, html) {
    tooltip.html(html).style('opacity', 1)
        .style('left', (event.clientX + 14) + 'px')
        .style('top', (event.clientY - 24) + 'px');
}
function hideTooltip() { tooltip.style('opacity', 0); }

// Helper: add chart section wrapper
function addSection(titleText) {
    const sec = vis.append('div').style('position', 'relative');
    sec.append('div')
        .text(titleText)
        .style('font-weight', '700')
        .style('font-size', '14px')
        .style('margin-bottom', '6px')
        .style('color', '#333');
    return sec;
}

const pcSection = addSection('Parallel Coordinates — Quantitative Weather Attributes (Weekly Averages)');
const pcSvg = pcSection.append('svg').attr('width', WIDTH).attr('height', PC_H);

const legendSection = vis.append('div')
    .style('display', 'flex').style('gap', '20px').style('align-items', 'center').style('font-size','13px');
legendSection.append('span').text('Colour by Location Type:').style('font-weight','600');
['Coastal','Continental','Mountain'].forEach(loc => {
    const item = legendSection.append('div').style('display','flex').style('align-items','center').style('gap','5px');
    item.append('svg').attr('width',14).attr('height',14)
        .append('rect').attr('width',14).attr('height',14).attr('rx',3)
        .attr('fill', locationColors(loc));
    item.append('span').text(loc);
});

const psSection = addSection('Parallel Sets — Categorical Breakdown: Season → Location Type → Station (click node to filter)');
const psSvg = psSection.append('svg').attr('width', WIDTH).attr('height', PS_H);

const tsSection = addSection('Time Series — Weekly Average Temperature per Station (linear arrangement, discrete scale)');
const tsSvg = tsSection.append('svg').attr('width', WIDTH).attr('height', TS_H);

// Reset button
const resetBtn = vis.append('button')
    .text('Reset All Filters')
    .style('align-self', 'flex-start')
    .style('padding', '7px 18px')
    .style('background', '#e53935')
    .style('color', '#fff')
    .style('border', 'none')
    .style('border-radius', '5px')
    .style('cursor', 'pointer')
    .style('font-size', '13px')
    .on('click', () => {
        state.pcExtents = {};
        state.psFilter = null;
        state.tsBrush = null;
        // Clear PC brushes
        pcSvg.selectAll('.pc-axis').selectAll('.overlay').each(function() {
            d3.select(this.parentNode).call(d3.brush().clear, null);
        });
        pcSvg.selectAll('.brush').call(d => { try { d.call(d3.brushY().clear); } catch(e){} });
        // Clear TS brush
        tsSvg.select('.ts-brush').call(d3.brushX().move, null);
        filteredData = [...aggregatedData];
        updateDashboard(false);
    });

// ============================================================================
// DATA LOADING
// ============================================================================
Promise.all([
    d3.csv('data/reduced_daily_climate_summary.csv', d3.autoType),
    d3.csv('data/station.csv', d3.autoType)
]).then(([weather, stations]) => {
    const stationMap = new Map(stations.map(s => [s.STATION_ID, s]));

    weather.forEach(d => {
        const st = stationMap.get(d.STATION_ID);
        if (!st) return;
        d.STATION_NAME = st.STATION_NAME;
        d.HEIGHT_ABOVE_SEA_LEVEL_M = +st.HEIGHT_ABOVE_SEA_LEVEL_M;
        d.DISTANCE_TO_SEA_KM = +st.DISTANCE_TO_SEA_KM;
        d.DATE = new Date(d.DATE);
        const m = d.DATE.getMonth();
        d.Year = d.DATE.getFullYear();
        d.Season = getSeason(m);
        d.LocationType = getLocationType(d.DISTANCE_TO_SEA_KM, d.HEIGHT_ABOVE_SEA_LEVEL_M);
    });

    // Clean: keep rows with all essential values
    globalData = weather.filter(d =>
        d.TEMPERATURE_AIR != null && d.HUMIDITY != null && d.PRESSURE_AIR != null && d.STATION_NAME
    );

    // Guaranteed Visibility: pull absolute min from RAW daily data
    lowestTempItem = globalData.reduce((best, d) =>
        (d.TEMPERATURE_AIR_MIN != null && (best === null || d.TEMPERATURE_AIR_MIN < best.TEMPERATURE_AIR_MIN)) ? d : best, null);

    // Reduction strategy: Weekly Aggregation (safer than sampling — conveys info about entire set)
    aggregatedData = aggregateToWeekly(globalData);
    filteredData = [...aggregatedData];

    initDashboard();
});

// ============================================================================
// HELPERS
// ============================================================================
function getSeason(m) {
    if (m === 11 || m <= 1) return 'Winter';
    if (m <= 4) return 'Spring';
    if (m <= 7) return 'Summer';
    return 'Fall';
}

function getLocationType(dist, height) {
    if (dist < 100) return 'Coastal';
    if (height > 500) return 'Mountain';
    return 'Continental';
}

function aggregateToWeekly(data) {
    const result = [];
    const groups = d3.groups(data, d => d.STATION_ID, d => d3.timeWeek(d.DATE).getTime());
    groups.forEach(([, weeks]) => {
        weeks.forEach(([weekTime, days]) => {
            const f = days[0];
            result.push({
                STATION_ID: f.STATION_ID,
                STATION_NAME: f.STATION_NAME,
                DATE: new Date(weekTime),
                Year: f.Year,
                Season: f.Season,
                LocationType: f.LocationType,
                HEIGHT_ABOVE_SEA_LEVEL_M: f.HEIGHT_ABOVE_SEA_LEVEL_M,
                DISTANCE_TO_SEA_KM: f.DISTANCE_TO_SEA_KM,
                TEMPERATURE_AIR: d3.mean(days, d => d.TEMPERATURE_AIR),
                HUMIDITY: d3.mean(days, d => d.HUMIDITY),
                PRESSURE_AIR: d3.mean(days, d => d.PRESSURE_AIR),
                SUNSHINE_DURATION: d3.sum(days, d => d.SUNSHINE_DURATION),
                SNOW_DEPTH: d3.mean(days, d => d.SNOW_DEPTH),
                TEMPERATURE_AIR_MIN: d3.min(days, d => d.TEMPERATURE_AIR_MIN),
                TEMPERATURE_AIR_MAX: d3.max(days, d => d.TEMPERATURE_AIR_MAX),
            });
        });
    });
    return result.sort((a, b) => a.DATE - b.DATE);
}

// ============================================================================
// INIT & UPDATE
// ============================================================================
function initDashboard() {
    renderParallelCoordinates();
    renderParallelSets();
    renderTimeSeries();
}

function updateDashboard(refilter = true) {
    if (refilter) {
        filteredData = aggregatedData.filter(d => {
            for (const [dim, [lo, hi]] of Object.entries(state.pcExtents)) {
                const v = d[dim]; if (v == null || v < lo || v > hi) return false;
            }
            if (state.tsBrush && (d.DATE < state.tsBrush[0] || d.DATE > state.tsBrush[1])) return false;
            if (state.psFilter && d[state.psFilter.category] !== state.psFilter.value) return false;
            return true;
        });
    }
    updateParallelCoordinates();
    updateParallelSets();
    updateTimeSeries();
}

// ============================================================================
// PARALLEL COORDINATES
// ============================================================================
const PC_DIMS = ['TEMPERATURE_AIR', 'HUMIDITY', 'PRESSURE_AIR', 'SUNSHINE_DURATION', 'SNOW_DEPTH', 'HEIGHT_ABOVE_SEA_LEVEL_M', 'DISTANCE_TO_SEA_KM'];
const DIM_LABELS = {
    TEMPERATURE_AIR: 'Temp (°C)', HUMIDITY: 'Humidity (%)', PRESSURE_AIR: 'Pressure (hPa)',
    SUNSHINE_DURATION: 'Sunshine (h)', SNOW_DEPTH: 'Snow (cm)',
    HEIGHT_ABOVE_SEA_LEVEL_M: 'Altitude (m)', DISTANCE_TO_SEA_KM: 'Dist. Sea (km)'
};
let pcY = {}, pcX, pcAllLines;
const filteredSet = new Set();

function renderParallelCoordinates() {
    const inner_w = WIDTH - MARGIN.left - MARGIN.right;
    const inner_h = PC_H - MARGIN.top - MARGIN.bottom;

    PC_DIMS.forEach(d => {
        pcY[d] = d3.scaleLinear()
            .domain(d3.extent(aggregatedData, p => p[d]))
            .nice()
            .range([inner_h, 0]);
    });

    pcX = d3.scalePoint()
        .domain(PC_DIMS)
        .range([0, inner_w])
        .padding(0.15);

    const g = pcSvg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Background (all lines, faint)
    const bgG = g.append('g').attr('class', 'pc-bg');
    bgG.selectAll('path')
        .data(aggregatedData)
        .enter().append('path')
        .attr('class', 'pc-line-bg')
        .attr('d', d => pcPath(d))
        .style('fill', 'none')
        .style('stroke', d => locationColors(d.LocationType))
        .style('stroke-width', 0.8)
        .style('opacity', 0.04);

    // Foreground (filtered lines, highlighted)
    const fgG = g.append('g').attr('class', 'pc-fg');
    pcAllLines = fgG.selectAll('path')
        .data(aggregatedData)
        .enter().append('path')
        .attr('class', 'pc-line-fg')
        .attr('d', d => pcPath(d))
        .style('fill', 'none')
        .style('stroke', d => locationColors(d.LocationType))
        .style('stroke-width', 1.5)
        .style('opacity', 0.35)
        .on('mouseover', function(event, d) {
            d3.select(this).style('stroke-width', 3).style('opacity', 1);
            showTooltip(event,
                `<b>${d.STATION_NAME}</b> (${d.LocationType})<br>
                 Date: ${d3.timeFormat('%b %Y')(d.DATE)}<br>
                 Temp: ${d.TEMPERATURE_AIR?.toFixed(1)}°C &nbsp; Humidity: ${d.HUMIDITY?.toFixed(1)}%<br>
                 Pressure: ${d.PRESSURE_AIR?.toFixed(1)} hPa`);
        })
        .on('mousemove', function(event) {
            tooltip.style('left', (event.clientX + 14) + 'px').style('top', (event.clientY - 24) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).style('stroke-width', 1.5).style('opacity', 0.35);
            hideTooltip();
        });

    // Axes
    const axisG = g.selectAll('.pc-axis')
        .data(PC_DIMS).enter()
        .append('g')
        .attr('class', 'pc-axis')
        .attr('transform', d => `translate(${pcX(d)},0)`);

    axisG.each(function(d) {
        d3.select(this).call(d3.axisLeft(pcY[d]).ticks(6));
    });

    axisG.append('text')
        .attr('y', -14)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#333')
        .style('font-weight', '600')
        .text(d => DIM_LABELS[d] || d);

    // Brushes on each axis
    axisG.append('g')
        .attr('class', 'brush')
        .each(function(d) {
            d3.select(this).call(
                d3.brushY()
                    .extent([[-12, 0], [12, inner_h]])
                    .on('start brush end', (event) => brushPC(event, d))
            );
        });
}

function pcPath(d) {
    return d3.line()(PC_DIMS.map(p => [pcX(p), pcY[p](d[p])]));
}

function brushPC(event, dim) {
    if (!event.selection) {
        delete state.pcExtents[dim];
    } else {
        const [y1, y2] = event.selection;
        state.pcExtents[dim] = [pcY[dim].invert(y2), pcY[dim].invert(y1)];
    }
    updateDashboard();
}

function updateParallelCoordinates() {
    const fSet = new Set(filteredData);
    pcAllLines
        .style('opacity', d => fSet.has(d) ? 0.5 : 0.02)
        .style('stroke-width', d => fSet.has(d) ? 1.8 : 0.7);
}

// ============================================================================
// PARALLEL SETS (Sankey layout)
// ============================================================================
let sankeyLayout;

function buildSankeyData(data) {
    const nodesMap = new Map();
    const linksMap = new Map();
    let ni = 0;

    function nodeId(layer, name) {
        const key = `${layer}::${name}`;
        if (!nodesMap.has(key)) nodesMap.set(key, { node: ni++, name, category: layer });
        return nodesMap.get(key).node;
    }

    data.forEach(d => {
        const s = nodeId('Season', d.Season);
        const l = nodeId('LocationType', d.LocationType);
        const st = nodeId('STATION_NAME', d.STATION_NAME);

        const k1 = `${s}>${l}`;
        if (!linksMap.has(k1)) linksMap.set(k1, { source: s, target: l, value: 0 });
        linksMap.get(k1).value++;

        const k2 = `${l}>${st}`;
        if (!linksMap.has(k2)) linksMap.set(k2, { source: l, target: st, value: 0 });
        linksMap.get(k2).value++;
    });

    return { nodes: [...nodesMap.values()], links: [...linksMap.values()] };
}

function renderParallelSets() {
    sankeyLayout = sankey()
        .nodeWidth(14)
        .nodePadding(8)
        .extent([[MARGIN.left, MARGIN.top], [WIDTH - MARGIN.right, PS_H - MARGIN.bottom]])
        .nodeAlign(sankeyLeft);
    updateParallelSets();
}

function updateParallelSets() {
    psSvg.selectAll('*').remove();
    if (filteredData.length === 0) {
        psSvg.append('text').attr('x', WIDTH / 2).attr('y', PS_H / 2)
            .attr('text-anchor', 'middle').text('No data in current filter range.')
            .style('fill', '#999');
        return;
    }

    // Column headers
    ['Season', 'Location Type', 'Station'].forEach((label, i) => {
        const xPos = MARGIN.left + i * (WIDTH - MARGIN.left - MARGIN.right) / 2;
        psSvg.append('text').attr('x', xPos).attr('y', MARGIN.top - 10)
            .style('font-size', '11px').style('font-weight', '700').style('fill', '#555')
            .text(label);
    });

    const { nodes, links } = sankeyLayout(buildSankeyData(filteredData));

    // Draw links
    psSvg.append('g').selectAll('path')
        .data(links)
        .enter().append('path')
        .attr('d', sankeyLinkHorizontal())
        .style('fill', 'none')
        .style('stroke', d => locationColors(d.source.name) || '#aaa')
        .style('stroke-width', d => Math.max(1, d.width))
        .style('opacity', 0.35)
        .on('mouseover', function(event, d) {
            d3.select(this).style('opacity', 0.7);
            showTooltip(event, `<b>${d.source.name}</b> → <b>${d.target.name}</b><br>Count: ${d.value}`);
        })
        .on('mousemove', (event) => {
            tooltip.style('left', (event.clientX + 14) + 'px').style('top', (event.clientY - 24) + 'px');
        })
        .on('mouseout', function() { d3.select(this).style('opacity', 0.35); hideTooltip(); });

    // Draw nodes
    const nodeG = psSvg.append('g').selectAll('g')
        .data(nodes)
        .enter().append('g')
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
            if (state.psFilter && state.psFilter.value === d.name) {
                state.psFilter = null;
            } else {
                state.psFilter = { category: d.category, value: d.name };
            }
            updateDashboard();
        });

    nodeG.append('rect')
        .attr('x', d => d.x0).attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0).attr('height', d => Math.max(1, d.y1 - d.y0))
        .attr('fill', d => locationColors(d.name) || '#888')
        .attr('stroke', d => (state.psFilter && state.psFilter.value === d.name) ? '#000' : 'none')
        .attr('stroke-width', 2)
        .on('mouseover', function(event, d) {
            showTooltip(event, `<b>${d.name}</b> (${d.category.replace('_', ' ')})<br>Count: ${d.value}`);
        })
        .on('mousemove', (event) => {
            tooltip.style('left', (event.clientX + 14) + 'px').style('top', (event.clientY - 24) + 'px');
        })
        .on('mouseout', hideTooltip);

    nodeG.append('text')
        .attr('x', d => d.x0 > WIDTH / 2 ? d.x0 - 6 : d.x1 + 6)
        .attr('y', d => (d.y0 + d.y1) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => d.x0 > WIDTH / 2 ? 'end' : 'start')
        .style('font-size', '10px')
        .style('fill', '#333')
        .text(d => d.name);
}

// ============================================================================
// TIME SERIES
// ============================================================================
let tsX, tsY, tsLinesG;

function renderTimeSeries() {
    const inner_w = WIDTH - MARGIN.left - MARGIN.right;
    const inner_h = TS_H - MARGIN.top - MARGIN.bottom;

    tsX = d3.scaleTime()
        .domain(d3.extent(aggregatedData, d => d.DATE))
        .range([0, inner_w]);

    // Full range includes weekly min/max for Guaranteed Visibility marker
    const yMin = Math.min(d3.min(aggregatedData, d => d.TEMPERATURE_AIR), lowestTempItem?.TEMPERATURE_AIR_MIN ?? 0);
    const yMax = d3.max(aggregatedData, d => d.TEMPERATURE_AIR);
    tsY = d3.scaleLinear().domain([yMin - 2, yMax + 2]).nice().range([inner_h, 0]);

    const g = tsSvg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    g.append('g').attr('transform', `translate(0,${inner_h})`).call(d3.axisBottom(tsX).ticks(10));
    g.append('g').call(d3.axisLeft(tsY).ticks(8));

    // Y label
    g.append('text').attr('transform', 'rotate(-90)').attr('y', -48).attr('x', -inner_h / 2)
        .attr('text-anchor', 'middle').style('font-size', '11px').style('fill', '#555')
        .text('Temperature (°C)');

    // Lines group (updated on filter)
    tsLinesG = g.append('g').attr('class', 'ts-lines');

    // Guaranteed Visibility: absolute min dot — rendered ABOVE lines
    if (lowestTempItem) {
        const gv = g.append('g').attr('class', 'ts-guaranteed');
        gv.append('circle')
            .attr('cx', tsX(lowestTempItem.DATE))
            .attr('cy', tsY(lowestTempItem.TEMPERATURE_AIR_MIN))
            .attr('r', 6)
            .attr('fill', 'red')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);
        gv.append('text')
            .attr('x', tsX(lowestTempItem.DATE) + 10)
            .attr('y', tsY(lowestTempItem.TEMPERATURE_AIR_MIN) + 4)
            .style('font-size', '11px').style('fill', 'red').style('font-weight', 'bold')
            .text(`Absolute Min: ${lowestTempItem.TEMPERATURE_AIR_MIN}°C — ${lowestTempItem.STATION_NAME}, ${lowestTempItem.Year}`);
    }

    // Brush for time filtering (linked to PC and PS)
    const brush = d3.brushX()
        .extent([[0, 0], [inner_w, inner_h]])
        .on('end', event => {
            if (!event.selection) {
                state.tsBrush = null;
            } else {
                state.tsBrush = event.selection.map(tsX.invert);
            }
            updateDashboard();
        });
    g.append('g').attr('class', 'ts-brush').call(brush);

    updateTimeSeries();
}

function updateTimeSeries() {
    tsLinesG.selectAll('*').remove();
    const stations = d3.group(filteredData, d => d.STATION_NAME);

    const line = d3.line()
        .defined(d => d.TEMPERATURE_AIR != null)
        .x(d => tsX(d.DATE))
        .y(d => tsY(d.TEMPERATURE_AIR))
        .curve(d3.curveMonotoneX);

    for (const [, stData] of stations) {
        tsLinesG.append('path')
            .datum(stData)
            .attr('fill', 'none')
            .attr('stroke', locationColors(stData[0].LocationType))
            .attr('stroke-width', 1.5)
            .attr('d', line)
            .style('opacity', 0.7)
            .on('mouseover', function(event) {
                d3.select(this).style('stroke-width', 3).style('opacity', 1);
                showTooltip(event, `<b>${stData[0].STATION_NAME}</b> (${stData[0].LocationType})`);
            })
            .on('mousemove', (event) => {
                tooltip.style('left', (event.clientX + 14) + 'px').style('top', (event.clientY - 24) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).style('stroke-width', 1.5).style('opacity', 0.7);
                hideTooltip();
            });
    }
}
