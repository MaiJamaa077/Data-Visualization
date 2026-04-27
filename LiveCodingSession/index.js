// load all the modules from d3
import * as d3 from 'd3'

// load the csv data
// d3.autoType loads true to type, such that numbers are loaded as numbers not strings. 
d3.csv('./data/penguins.csv', d3.autoType)
.then(penguins => {
    // prints the data to the console
    console.log(penguins);
    const attributes = Object.keys(penguins[0]);
    console.log(attributes);
    

    // Data preparation
    const data = Array.from(
        d3.rollup(
            penguins.filter(d => d.species !== null),
            v => v.length,
            d => d.species
        ),
        ([name, value]) => ({ name, value })
    );

    // Layout plot
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    const svg = d3.select('#visualization')
        .attr('width', width)
        .attr('height', height);

    // Define encodings
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Draw axes
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Draw marks
    svg.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => xScale(d.name))
        .attr('y', d => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(0) - yScale(d.value));

})