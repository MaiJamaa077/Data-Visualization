import * as d3 from 'd3';

const base_path = 'data/'
const files = ['reduced_daily_climate_summary.csv', 'station.csv'];

let globalState = {
    selectedStation: null,
    timeRange: null,
    timeZoomDomain: null,
    categoryFilters: {
        location: null,
        elevation: null,
        pressure: null
    }
};

const tooltip = d3.select("#tooltip");

Promise.all(files.map(d => d3.csv(base_path + d, d3.autoType)))
    .then(([weatherData, stationData]) => {
        
        const stationMap = new Map(stationData.map(d => [d.STATION_ID, d]));

        
        const pressureValues = weatherData.map(d => d.PRESSURE_AIR).filter(d => d != null).sort(d3.ascending);
        const pMedian = d3.median(pressureValues);
        
        // Merging and categorizing data
        const processedData = weatherData
            .filter(d => d.TEMPERATURE_AIR != null && d.HUMIDITY != null && d.PRESSURE_AIR != null && d.DATE != null)
            .map(d => {
                const station = stationMap.get(d.STATION_ID);
                
                const locationType = station.DISTANCE_TO_SEA_KM <= 100 ? "Coastal" : "Continental";
                const elevationType = station.HEIGHT_ABOVE_SEA_LEVEL_M >= 500 ? "Mountain" : "Sea-level";
                const pressureCategory = d.PRESSURE_AIR < pMedian ? "Low" : "High";
                
                let parsedDate = typeof d.DATE === "string" ? new Date(d.DATE.trim()) : new Date(d.DATE);

                return {
                    ...d,
                    date: parsedDate, 
                    stationName: station.STATION_NAME,
                    locationType: locationType,
                    elevationType: elevationType,
                    pressureCategory: pressureCategory
                };
            })
            .filter((d) => !isNaN(d.date) && !isNaN(d.HUMIDITY))
            .sort((a, b) => d3.ascending(a.date, b.date));

        const stations = Array.from(new Set(processedData.map(d => d.stationName)));
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(stations);
        
        const updateAllCharts = () => {
            let filteredData = processedData;

            if (globalState.timeRange) {
                filteredData = filteredData.filter(d => d.date >= globalState.timeRange[0] && d.date <= globalState.timeRange[1]);
            }
            if (globalState.selectedStation) {
                filteredData = filteredData.filter(d => d.stationName === globalState.selectedStation);
            }
            if (globalState.categoryFilters.location) {
                filteredData = filteredData.filter(d => d.locationType === globalState.categoryFilters.location);
            }
            if (globalState.categoryFilters.elevation) {
                filteredData = filteredData.filter(d => d.elevationType === globalState.categoryFilters.elevation);
            }
            if (globalState.categoryFilters.pressure) {
                filteredData = filteredData.filter(d => d.pressureCategory === globalState.categoryFilters.pressure);
            }

            drawParallelCoordinates(filteredData, colorScale);
            drawParallelSets(filteredData);
            drawTimeSeries(processedData, filteredData, colorScale);
        };

        updateAllCharts();

      function drawTimeSeries(fullData, filteredData, colorScale) {
            const container = d3.select("#time-series-view");
            container.selectAll("svg").remove(); 

            const margin = { top: 20, right: 150, bottom: 30, left: 50 };
            const width = 650 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;

            const svg = container.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const currentDomain = globalState.timeZoomDomain || d3.extent(fullData, d => d.date);

            const x = d3.scaleTime().domain(currentDomain).range([0, width]);
            const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

            svg.append("g").call(d3.axisLeft(y));
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -35)
                .attr("x", -height / 2)
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .text("Humidity (%)");

            const domainDays = (currentDomain[1] - currentDomain[0]) / (1000 * 60 * 60 * 24);
            let zoomTarget = "year";
            if (domainDays <= 40) zoomTarget = "day";
            else if (domainDays <= 400) zoomTarget = "month";

      const bottomAxis = d3.axisBottom(x);
            
            if (zoomTarget === "year") {
                bottomAxis.ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y"));
            } else if (zoomTarget === "month") {
                bottomAxis.ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b"));
            } else {
                // FORCE every 4 days so they physically cannot crowd the screen
                bottomAxis.ticks(d3.timeDay.every(4)).tickFormat(d3.timeFormat("%b %d"));
            }

            const xAxis = svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(bottomAxis);

            // ROTATE labels 45 degrees to completely eliminate any chance of overlapping
            xAxis.selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em");

            
            xAxis.selectAll(".tick text")
                .style("cursor", zoomTarget !== "day" ? "pointer" : "default")
                .style("fill", zoomTarget !== "day" ? "#0066cc" : "black")
                .style("text-decoration", zoomTarget !== "day" ? "underline" : "none")
                .on("click", (event, d) => {
                    event.stopPropagation(); 
                    if (zoomTarget === "year") {
                        globalState.timeZoomDomain = [new Date(d.getFullYear(), 0, 1), new Date(d.getFullYear(), 11, 31)];
                        updateAllCharts();
                    } else if (zoomTarget === "month") {
                        globalState.timeZoomDomain = [new Date(d.getFullYear(), d.getMonth(), 1), new Date(d.getFullYear(), d.getMonth() + 1, 0)];
                        updateAllCharts();
                    }
                });

            const line = d3.line()
                .defined(d => !isNaN(d.HUMIDITY) && d.HUMIDITY !== null && d.date !== null) 
                .x(d => x(d.date))
                .y(d => y(d.HUMIDITY));

            const visibleData = filteredData.filter(d => d.date >= currentDomain[0] && d.date <= currentDomain[1]);
            const dataByStation = Array.from(d3.group(visibleData, d => d.stationName));

            // Draw Lines
            svg.selectAll(".ts-line")
                .data(dataByStation)
                .join("path")
                .attr("class", "ts-line")
                .attr("fill", "none")
                .attr("stroke", d => colorScale(d[0]))
                .attr("stroke-width", d => globalState.selectedStation === d[0] ? 3 : 1.5)
                .attr("opacity", d => globalState.selectedStation && globalState.selectedStation !== d[0] ? 0.2 : 0.7)
                .attr("d", d => line(d[1]))
                .style("pointer-events", "none"); 

            // BRUSH LOGIC
            const brush = d3.brushX()
                .extent([[0, 0], [width, height]])
                .on("end", (event) => {
                    if (!event.selection) {
                        const wasAlreadyClear = globalState.timeRange === null;
                        globalState.timeRange = null;
                        
                        
                        if (wasAlreadyClear && event.sourceEvent && (event.sourceEvent.type === "mouseup" || event.sourceEvent.type === "click")) {
                            globalState = {
                                selectedStation: null,
                                timeRange: null,
                                timeZoomDomain: null,
                                categoryFilters: { location: null, elevation: null, pressure: null }
                            };
                        }
                    } else {
                        globalState.timeRange = [x.invert(event.selection[0]), x.invert(event.selection[1])];
                    }
                    updateAllCharts();
                });

            const brushGroup = svg.append("g").attr("class", "brush").call(brush);

            const hoverLine = svg.append("line")
                .attr("y1", 0)
                .attr("y2", height)
                .style("stroke", "#666")
                .style("stroke-width", "1px")
                .style("stroke-dasharray", "4,4")
                .style("opacity", 0)
                .style("pointer-events", "none");

           
            const uniqueDates = Array.from(new Set(visibleData.map(d => d.date.getTime()))).sort(d3.ascending);

         
            brushGroup.selectAll(".overlay, .selection")
                .on("mousemove", function(event) {
                    if (uniqueDates.length === 0) return;
                    
                    
                    const mouseX = d3.pointer(event)[0];
                    const mouseDate = x.invert(mouseX).getTime();
                    
              
                    const bisect = d3.bisector(d => d).left;
                    let idx = bisect(uniqueDates, mouseDate);
                    
                    if (idx === 0) idx = 1;
                    if (idx >= uniqueDates.length) idx = uniqueDates.length - 1;
                    
                    const d0 = uniqueDates[idx - 1];
                    const d1 = uniqueDates[idx];
                    const closestDate = mouseDate - d0 > d1 - mouseDate ? d1 : d0;
                    
                    
                    const exactX = x(new Date(closestDate));
                    hoverLine.attr("x1", exactX).attr("x2", exactX).style("opacity", 1);
                    
                     
                    const hoverData = visibleData.filter(d => d.date.getTime() === closestDate);
                    hoverData.sort((a, b) => d3.descending(a.HUMIDITY, b.HUMIDITY)); 
                    
                   
                    let tooltipHtml = `<div style="margin-bottom: 5px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px;">
                                        ${d3.timeFormat("%b %d, %Y")(new Date(closestDate))}
                                       </div>`;
                    
                    hoverData.forEach(d => {
                        const isSelected = globalState.selectedStation === d.stationName;
                        const weight = isSelected ? "bold" : "normal";
                        const opacity = (globalState.selectedStation && !isSelected) ? 0.3 : 1;
                        
                        tooltipHtml += `
                            <div style="font-weight: ${weight}; opacity: ${opacity}; font-size: 12px; margin-bottom: 2px;">
                                <span style="color:${colorScale(d.stationName)}; font-size: 14px;">■</span> 
                                ${d.stationName}: ${d.HUMIDITY}%
                            </div>`;
                    });
                    
                
                    tooltip.style("opacity", 1)
                        .html(tooltipHtml)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseleave", function() {
                     
                    hoverLine.style("opacity", 0);
                    tooltip.style("opacity", 0);
                });
            

function drawTimeSeries(fullData, filteredData, colorScale) {
            const container = d3.select("#time-series-view");
            container.selectAll("svg").remove(); 

            const margin = { top: 20, right: 150, bottom: 30, left: 50 };
            const width = 800 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;

            const svg = container.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const currentDomain = globalState.timeZoomDomain || d3.extent(fullData, d => d.date);

            const x = d3.scaleTime().domain(currentDomain).range([0, width]);
            const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

            svg.append("g").call(d3.axisLeft(y));
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -35)
                .attr("x", -height / 2)
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .text("Humidity (%)");

            const domainDays = (currentDomain[1] - currentDomain[0]) / (1000 * 60 * 60 * 24);
            let zoomTarget = "year";
            if (domainDays <= 40) zoomTarget = "day";
            else if (domainDays <= 400) zoomTarget = "month";

            const xAxis = svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            // X-Axis Drill Down
            xAxis.selectAll(".tick text")
                .style("cursor", zoomTarget !== "day" ? "pointer" : "default")
                .style("fill", zoomTarget !== "day" ? "#0066cc" : "black")
                .style("text-decoration", zoomTarget !== "day" ? "underline" : "none")
                .on("click", (event, d) => {
                    event.stopPropagation(); 
                    if (zoomTarget === "year") {
                        globalState.timeZoomDomain = [new Date(d.getFullYear(), 0, 1), new Date(d.getFullYear(), 11, 31)];
                        updateAllCharts();
                    } else if (zoomTarget === "month") {
                        globalState.timeZoomDomain = [new Date(d.getFullYear(), d.getMonth(), 1), new Date(d.getFullYear(), d.getMonth() + 1, 0)];
                        updateAllCharts();
                    }
                });

            const line = d3.line()
                .defined(d => !isNaN(d.HUMIDITY) && d.HUMIDITY !== null && d.date !== null) 
                .x(d => x(d.date))
                .y(d => y(d.HUMIDITY));

            const visibleData = filteredData.filter(d => d.date >= currentDomain[0] && d.date <= currentDomain[1]);
            const dataByStation = Array.from(d3.group(visibleData, d => d.stationName));

            // Draw Lines
            svg.selectAll(".ts-line")
                .data(dataByStation)
                .join("path")
                .attr("class", "ts-line")
                .attr("fill", "none")
                .attr("stroke", d => colorScale(d[0]))
                .attr("stroke-width", d => globalState.selectedStation === d[0] ? 3 : 1.5)
                .attr("opacity", d => globalState.selectedStation && globalState.selectedStation !== d[0] ? 0.2 : 0.7)
                .attr("d", d => line(d[1]))
                .style("pointer-events", "none"); 

            // BRUSH LOGIC
            const brush = d3.brushX()
                .extent([[0, 0], [width, height]])
                .on("end", (event) => {
                    if (!event.selection) {
                        const wasAlreadyClear = globalState.timeRange === null;
                        globalState.timeRange = null;
                        
                        // If it was already clear, and this was a user click, Zoom Out / Reset!
                        if (wasAlreadyClear && event.sourceEvent && (event.sourceEvent.type === "mouseup" || event.sourceEvent.type === "click")) {
                            globalState = {
                                selectedStation: null,
                                timeRange: null,
                                timeZoomDomain: null,
                                categoryFilters: { location: null, elevation: null, pressure: null }
                            };
                        }
                    } else {
                        globalState.timeRange = [x.invert(event.selection[0]), x.invert(event.selection[1])];
                    }
                    updateAllCharts();
                });

            const brushGroup = svg.append("g").attr("class", "brush").call(brush);

        
            const hoverLine = svg.append("line")
                .attr("y1", 0)
                .attr("y2", height)
                .style("stroke", "#666")
                .style("stroke-width", "1px")
                .style("stroke-dasharray", "4,4")
                .style("opacity", 0)
                .style("pointer-events", "none");

             
            const uniqueDates = Array.from(new Set(visibleData.map(d => d.date.getTime()))).sort(d3.ascending);

          
            brushGroup.selectAll(".overlay, .selection")
                .on("mousemove", function(event) {
                    if (uniqueDates.length === 0) return;
                    
                     
                    const mouseX = d3.pointer(event)[0];
                    const mouseDate = x.invert(mouseX).getTime();
                    
                     
                    const bisect = d3.bisector(d => d).left;
                    let idx = bisect(uniqueDates, mouseDate);
                    
                    if (idx === 0) idx = 1;
                    if (idx >= uniqueDates.length) idx = uniqueDates.length - 1;
                    
                    const d0 = uniqueDates[idx - 1];
                    const d1 = uniqueDates[idx];
                    const closestDate = mouseDate - d0 > d1 - mouseDate ? d1 : d0;
                    
           
                    const exactX = x(new Date(closestDate));
                    hoverLine.attr("x1", exactX).attr("x2", exactX).style("opacity", 1);
                    
                    // Get all records for that exact date
                    const hoverData = visibleData.filter(d => d.date.getTime() === closestDate);
                    hoverData.sort((a, b) => d3.descending(a.HUMIDITY, b.HUMIDITY)); // Sort highest humidity first
                    
                  
                    let tooltipHtml = `<div style="margin-bottom: 5px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px;">
                                        ${d3.timeFormat("%b %d, %Y")(new Date(closestDate))}
                                       </div>`;
                    
                    hoverData.forEach(d => {
                        const isSelected = globalState.selectedStation === d.stationName;
                        const weight = isSelected ? "bold" : "normal";
                        const opacity = (globalState.selectedStation && !isSelected) ? 0.3 : 1;
                        
                        tooltipHtml += `
                            <div style="font-weight: ${weight}; opacity: ${opacity}; font-size: 12px; margin-bottom: 2px;">
                                <span style="color:${colorScale(d.stationName)}; font-size: 14px;">■</span> 
                                ${d.stationName}: ${d.HUMIDITY}%
                            </div>`;
                    });
                    
                
                    tooltip.style("opacity", 1)
                        .html(tooltipHtml)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseleave", function() {
                    
                    hoverLine.style("opacity", 0);
                    tooltip.style("opacity", 0);
                });
       


            
            const legend = svg.append("g").attr("transform", `translate(${width + 20}, 0)`);
            const stations = Array.from(colorScale.domain());    
            stations.forEach((station, i) => {
                const legendRow = legend.append("g")
                    .attr("transform", `translate(0, ${i * 20})`);
                    
                legendRow.append("rect")
                    .attr("width", 12)
                    .attr("height", 12)
                    .attr("fill", colorScale(station));
                    
                legendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .text(station)
                    .style("font-size", "11px")
                    .style("font-weight", globalState.selectedStation === station ? "bold" : "normal");
            });
        }
           
            const legend = svg.append("g").attr("transform", `translate(${width + 20}, 0)`);
            const stations = Array.from(colorScale.domain());    
            stations.forEach((station, i) => {
                const legendRow = legend.append("g")
                    .attr("transform", `translate(0, ${i * 20})`);
                    
                legendRow.append("rect")
                    .attr("width", 12)
                    .attr("height", 12)
                    .attr("fill", colorScale(station));
                    
                legendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .text(station)
                    .style("font-size", "11px")
                    .style("font-weight", globalState.selectedStation === station ? "bold" : "normal");
            });
        }

        function drawParallelCoordinates(data, colorScale) {
            const container = d3.select("#parallel-coords-view");
            container.selectAll("svg").remove();

            const margin = { top: 30, right: 50, bottom: 20, left: 50 };
            const width = 600 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;

            const svg = container.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const dimensions = ["TEMPERATURE_AIR", "HUMIDITY"];
            const y = {};
            for (let dim of dimensions) {
                y[dim] = d3.scaleLinear().domain(d3.extent(data, d => d[dim])).nice().range([height, 0]);
            }

            const x = d3.scalePoint().range([0, width]).padding(1).domain(dimensions);
            const path = d => d3.line()(dimensions.map(p => [x(p), y[p](d[p])]));

            const activeBrushes = {};

            const paths = svg.selectAll("myPath")
                .data(data)
                .join("path")
                .attr("d", path)
                .style("fill", "none")
                .style("stroke", d => colorScale(d.stationName))
                .style("opacity", d => globalState.selectedStation && globalState.selectedStation !== d.stationName ? 0.02 : 0.15)
                .style("stroke-width", d => globalState.selectedStation === d.stationName ? 3 : 1.5)
                .on("mouseover", function (event, d) {
                    d3.select(this).style("stroke-width", 4).style("opacity", 1);
                    tooltip.style("opacity", 1)
                        .html(`<strong>Station:</strong> ${d.stationName}<br/>
                               <strong>Date:</strong> ${d3.timeFormat("%Y-%m-%d")(d.date)}<br/>
                               <strong>Temp:</strong> ${d.TEMPERATURE_AIR}°C<br/>
                               <strong>Humidity:</strong> ${d.HUMIDITY}%`)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function (event, d) {
                    const isSelected = globalState.selectedStation === d.stationName;
                    d3.select(this)
                        .style("stroke-width", isSelected ? 3 : 1.5)
                        .style("opacity", globalState.selectedStation && !isSelected ? 0.02 : 0.15);
                    tooltip.style("opacity", 0);
                })
                .on("click", (event, d) => {
                    globalState.selectedStation = globalState.selectedStation === d.stationName ? null : d.stationName;
                    updateAllCharts();
                });

            const axes = svg.selectAll("myAxis")
                .data(dimensions).enter()
                .append("g")
                .attr("transform", d => `translate(${x(d)})`);
                
            axes.each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(d => d === "TEMPERATURE_AIR" ? "Temperature (°C)" : "Humidity (%)")
                .style("fill", "black")
                .style("font-weight", "bold");

            axes.append("g")
                .attr("class", "brush")
                .each(function (d) {
                    d3.select(this).call(d3.brushY()
                        .extent([[-15, 0], [15, height]])
                        .on("brush end", function(event) {
                            if (!event.selection) {
                                delete activeBrushes[d];
                            } else {
                                activeBrushes[d] = [
                                    y[d].invert(event.selection[1]),  
                                    y[d].invert(event.selection[0])   
                                ];
                            }
                            
                            paths.style("display", pathData => {
                                const isSelected = dimensions.every(p => {
                                    if (!activeBrushes[p]) return true;
                                    return pathData[p] >= activeBrushes[p][0] && pathData[p] <= activeBrushes[p][1];
                                });
                                return isSelected ? null : "none";
                            });
                        })
                    );
                });
        }

        function drawParallelSets(data) {
            const container = d3.select("#parallel-sets-view");
            container.selectAll("svg").remove();

            if (!data || data.length === 0) return;

            const margin = { top: 40, right: 20, bottom: 20, left: 100 };
            const width = 900 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = container.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const dimensions = ["locationType", "elevationType", "pressureCategory"];
            const color = d3.scaleOrdinal(d3.schemeSet2);

            const gap = 40; 
            const nodeHeight = 20; 
            const dimSpacing = height / (dimensions.length - 1);

            const flows = Array.from(d3.rollup(data, v => v.length, d => dimensions.map(dim => d[dim]).join("|")))
                .map(([key, count]) => {
                    return { key, count, dimensions: key.split("|"), pathD: "" };
                });
            
            flows.sort((a, b) => a.key.localeCompare(b.key));

            const allNodes = [];

            const dimPositions = dimensions.map((dim, dimIndex) => {
                const catMap = new Map();
                flows.forEach(flow => {
                    const cat = flow.dimensions[dimIndex];
                    if (!catMap.has(cat)) catMap.set(cat, []);
                    catMap.get(cat).push(flow);
                });

                const categories = Array.from(catMap.keys()).sort();
                const totalRecords = d3.sum(flows, f => f.count); 
                const availableWidth = width - (categories.length - 1) * gap;

                let xOffset = 0;
                const yPos = dimIndex * dimSpacing;
                const flowPositions = new Map();

                categories.forEach(cat => {
                    const catFlows = catMap.get(cat);
                    const catCount = d3.sum(catFlows, f => f.count);
                    const catWidth = (catCount / totalRecords) * availableWidth;

                    allNodes.push({ dim, category: cat, count: catCount, x: xOffset, y: yPos, width: catWidth });

                    let flowX = xOffset;
                    catFlows.forEach(f => {
                        const flowW = (f.count / totalRecords) * availableWidth;
                        flowPositions.set(f.key, { x0: flowX, x1: flowX + flowW, y: yPos });
                        flowX += flowW;
                    });

                    xOffset += catWidth + gap;
                });

                return { flowPositions };
            });

            flows.forEach(flow => {
                const positions = dimPositions.map(dp => dp.flowPositions.get(flow.key));

                let d = `M ${positions[0].x0} ${positions[0].y + nodeHeight} L ${positions[0].x1} ${positions[0].y + nodeHeight} `;

                for(let i = 0; i < positions.length - 1; i++) {
                    const pA = positions[i];
                    const pB = positions[i+1];
                    const yMid = (pA.y + nodeHeight + pB.y) / 2;
                    d += `C ${pA.x1} ${yMid}, ${pB.x1} ${yMid}, ${pB.x1} ${pB.y} `;
                }

                d += `L ${positions[positions.length-1].x0} ${positions[positions.length-1].y} `;

                for(let i = positions.length - 2; i >= 0; i--) {
                    const pA = positions[i];
                    const pB = positions[i+1];
                    const yMid = (pA.y + nodeHeight + pB.y) / 2;
                    d += `C ${pB.x0} ${yMid}, ${pA.x0} ${yMid}, ${pA.x0} ${pA.y + nodeHeight} `;
                }
                d += `Z`;

                flow.pathD = d;
                flow.sourceCat = flow.dimensions[0]; 
            });

            const ribbons = svg.selectAll(".ribbon")
                .data(flows)
                .enter().append("path")
                .attr("class", "ribbon")
                .attr("fill", d => color(d.sourceCat))
                .attr("opacity", 0.3)
                .attr("d", d => d.pathD)
                .on("mouseover", function(event, d) {
                    svg.selectAll(".ribbon").attr("opacity", 0.20); 
                    d3.select(this).attr("opacity", 0.8);
                    tooltip.style("opacity", 1)
                        .html(`<strong>Path:</strong> ${d.dimensions.join(" → ")}<br/><strong>Records:</strong> ${d.count}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 20) + "px");
                })
                .on("mouseout", function() {
                    svg.selectAll(".ribbon").attr("opacity", 0.3);
                    tooltip.style("opacity", 0);
                });

            // Parallel Sets Nodes 
            const nodeGroups = svg.selectAll(".node")
                .data(allNodes)
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .attr("cursor", d => d.dim === "locationType" ? "default" : "pointer")
                .on("mouseover", function(event, d) {
                    ribbons.attr("opacity", f => f.dimensions.includes(d.category) ? 0.8 : 0.20);
                })
                .on("mouseout", function() {
                    ribbons.attr("opacity", 0.3);
                })
                .on("click", (event, d) => {
                   
                    if (d.dim === "locationType") return;

                    const keyMap = { "locationType": "location", "elevationType": "elevation", "pressureCategory": "pressure" };
                    const filterKey = keyMap[d.dim];

                    if (globalState.categoryFilters[filterKey] === d.category) {
                        globalState.categoryFilters[filterKey] = null;
                    } else {
                        globalState.categoryFilters[filterKey] = d.category;
                    }
                    updateAllCharts();
                });

            nodeGroups.append("rect")
                .attr("width", d => d.width)
                .attr("height", nodeHeight)
                .attr("fill", d => d.dim === "locationType" ? color(d.category) : "#555")
                .attr("rx", 3);

            nodeGroups.append("text")
                .attr("x", d => d.width / 2)
                .attr("y", -8)
                .text(d => `${d.category} (${d.count})`)
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .style("fill", "#333");

            svg.selectAll(".dim-label")
                .data(dimensions)
                .enter().append("text")
                .attr("class", "dim-label")
                .attr("x", -20)
                .attr("y", (d, i) => i * dimSpacing + nodeHeight / 2)
                .text(d => {
                    if(d === "locationType") return "Location";
                    if(d === "elevationType") return "Elevation";
                    return "Pressure";
                })
                .style("text-anchor", "end")
                .style("alignment-baseline", "middle")
                .style("font-weight", "bold")
                .style("font-size", "14px");
        }
    })
    .catch(err => console.error("Data load or processing error:", err));