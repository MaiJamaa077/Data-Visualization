// load all the modules from d3
import * as d3 from 'd3'

// load the csv data 
d3.csv('./data/athlete_events.csv', d3.autoType)
.then(athletes => {
    // 1. Data Processing
    // Filter for Athletics and only those who won a medal
    const athleticsMedalists = athletes.filter(d => d.Sport === 'Athletics' && d.Medal && d.Medal !== 'NA');

    // Roll up data to count medals by Team
    const medalCounts = d3.rollup(
        athleticsMedalists,
        v => v.length,
        d => d.Team
    );

    // Convert Map to array and sort descending
    const data = Array.from(medalCounts, ([team, count]) => ({ team, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Top 20 for readability

    // 2. SVG Setup
    const margin = { top: 60, right: 100, bottom: 40, left: 180 };
    const width = 900 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#visualization")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 3. Scale Construction
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.team))
        .range([0, height])
        .padding(0.2);

    // 4. Axis Rendering
    // Hidden grid lines for Bauhaus minimalism
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5).tickSize(0))
        .call(g => g.select(".domain").remove())
        .selectAll("text")
        .style("font-family", "inherit")
        .style("font-size", "14px");

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .call(g => g.select(".domain").remove())
        .selectAll("text")
        .style("font-family", "inherit")
        .style("font-size", "14px");

    // 5. Element Rendering (Bars)
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", d => y(d.team))
        .attr("x", 0)
        .attr("width", d => x(d.count))
        .attr("height", y.bandwidth())
        .attr("fill", "#006189")
        .attr("rx", 2) 
        .attr("opacity", 0.9)
        .on("mouseover", function() { d3.select(this).attr("opacity", 1).attr("fill", "#007fb7"); })
        .on("mouseout", function() { d3.select(this).attr("opacity", 0.9).attr("fill", "#006189"); });

    // 6. Direct Labeling 
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.count) + 10)
        .attr("y", d => y(d.team) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(d => d.count)
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("fill", "#333");

    // 7. Axis Labels
    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "500")
        .style("fill", "#666")
        .text("Total Medal Count");

    // Y-axis label (Rotated)
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "500")
        .style("fill", "#666")
        .text("Olympic Team");

    // 8. Title and Annotations
    svg.append("text")
        .attr("x", -margin.left + 20)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "start")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Top 20 Teams by Athletic Medals (1896-2016)");
});