import * as d3 from "d3";


// load and filter the dataset (option 2, see A1 for option 1)
// for this task, we additionally filter for the winter season
const athletes = await d3.csv("data/athlete_events.csv", d3.autoType)
	.then(athlete => athlete.filter(athlete => athlete.Season == "Winter"))
console.log(athletes)

const city_country = await d3.json("data/city_to_country.json");
console.log(city_country);


let selectedTeam = null;
let selectedSport = null;


const validAthletes = athletes.filter(d => 
    d.Height && d.Height !== "NA" && 
    d.Weight && d.Weight !== "NA"
);
const hasMedal = (medalStr) => ["Gold", "Silver", "Bronze"].includes(medalStr);


const athleteStatsMap = d3.rollup(validAthletes, 
    v => {
        return {
            ID: v[0].ID,
            Name: v[0].Name,
            Height: v[0].Height,
            Weight: v[0].Weight,
            Sport: v[0].Sport,
            Team: v[0].Team,
            TotalMedals: d3.sum(v, d => hasMedal(d.Medal) ? 1 : 0)
        };
    }, 
    d => d.ID
);
// Convert the map back to an array 
let athleteStats = Array.from(athleteStatsMap.values());




const teamMedals = d3.rollup(athletes, v => d3.sum(v, d => hasMedal(d.Medal) ? 1 : 0), d => d.Team);


const allTopTeams = Array.from(teamMedals).sort((a, b) => b[1] - a[1]).slice(0, 50).map(d => d[0]);


let heatMapStartIndex = 0;
const heatMapWindowSize = 15;


const heatmapDataRaw = athletes.filter(d => allTopTeams.includes(d.Team));

const heatmapData = d3.rollups(heatmapDataRaw, 
    v => d3.sum(v, d => hasMedal(d.Medal) ? 1 : 0), 
    d => d.Sport, 
    d => d.Team
);



const uniqueAthletesMap = d3.rollup(athletes,
    v => ({
        ID: v[0].ID,
        Team: v[0].Team,
        Sport: v[0].Sport,
        Sex: v[0].Sex
    }),
    d => d.ID,       
    d => d.Sport     
);


let uniqueAthletes = [];
for (const [id, sportMap] of uniqueAthletesMap) {
    for (const [sport, data] of sportMap) {
        uniqueAthletes.push(data);
    }
}

function drawHeatmap() {
    const svg = d3.select("#heatmap-svg");
    svg.selectAll("*").remove(); // Clear previous drawing on update

    // 1. Setup Dimensions & Margins
    const margin = { top: 30, right: 30, bottom: 50, left: 150 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

 
    const currentTeams = allTopTeams.slice(heatMapStartIndex, heatMapStartIndex + heatMapWindowSize);

 
    const flatData = [];
    let maxCount = 0;
    
    for (const [sport, teams] of heatmapData) {
        for (const [team, count] of teams) {
             
            if (currentTeams.includes(team)) {
                flatData.push({ sport, team, count });
                if (count > maxCount) maxCount = count;
            }
        }
    }

    const uniqueSports = Array.from(new Set(flatData.map(d => d.sport))).sort();

    
    const xScale = d3.scaleBand()
        .domain(currentTeams)  
        .range([0, width])
        .padding(0.05);

    const yScale = d3.scaleBand()
        .domain(uniqueSports)
        .range([0, height])
        .padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, maxCount]);

     
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    g.append("g")
        .call(d3.axisLeft(yScale));

     
    g.selectAll("rect.cell")
        .data(flatData)
        .join("rect")
        .attr("class", "cell")
        .attr("x", d => xScale(d.team))
        .attr("y", d => yScale(d.sport))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(d.count))
        .attr("stroke", d => (selectedTeam === d.team && selectedSport === d.sport) ? "red" : "none")
        .attr("stroke-width", 3)
        .append("title")
        .text(d => `${d.team} - ${d.sport}\nTotal Medals: ${d.count}`);

    
    g.selectAll("rect.cell")
        .style("cursor", "pointer")
        .on("click", function(event, d) {
            if (selectedTeam === d.team && selectedSport === d.sport) {
                selectedTeam = null;
                selectedSport = null;
            } else {
                selectedTeam = d.team;
                selectedSport = d.sport;
            }
            updateDashboard();
        });

    
    let dragStartX = 0;
    const drag = d3.drag()
        .on("start", (event) => { 
            dragStartX = event.x; 
            svg.style("cursor", "grabbing");
        })
        .on("end", (event) => {
            svg.style("cursor", "default");
            const dragDistance = event.x - dragStartX;
            
            
            if (dragDistance < -40 && heatMapStartIndex < allTopTeams.length - heatMapWindowSize) {
                heatMapStartIndex += 5; // Pan 5 teams at a time
                if (heatMapStartIndex > allTopTeams.length - heatMapWindowSize) {
                    heatMapStartIndex = allTopTeams.length - heatMapWindowSize;
                }
                drawHeatmap();  
            } 
             
            else if (dragDistance > 40 && heatMapStartIndex > 0) {
                heatMapStartIndex -= 5;
                if (heatMapStartIndex < 0) heatMapStartIndex = 0;
                drawHeatmap();
            }
        });

     
    svg.call(drag);

    
    svg.append("text")
        .attr("x", margin.left + (width / 2))
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("fill", "#666")
        .style("font-size", "12px")
        .style("font-style", "italic")
        .text("← Click and drag horizontally to pan through teams →");
}

function drawScatterplot() {
    const svg = d3.select("#scatter-svg");
    svg.selectAll("*").remove(); 

   
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

     
    let filteredData = athleteStats;
     
    if (selectedSport) {
        filteredData = filteredData.filter(d => d.Sport === selectedSport);
        d3.select("#scatter-title").text(`Athlete Attributes: ${selectedSport}`);
    } else {
        d3.select("#scatter-title").text(`Athlete Attributes: All Sports`);
    }

    
    if (selectedTeam) {
        filteredData = filteredData.filter(d => d.Team === selectedTeam);
        let currentTitle = d3.select("#scatter-title").text();
        d3.select("#scatter-title").text(`${currentTitle} (${selectedTeam})`);
    }

     
    if (filteredData.length === 0) return;

 
    const xExtent = d3.extent(filteredData, d => d.Weight);
    const yExtent = d3.extent(filteredData, d => d.Height);
    
    const xScale = d3.scaleLinear()
        .domain([xExtent[0] - 5, xExtent[1] + 5])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([yExtent[0] - 5, yExtent[1] + 5])
        .range([height, 0]); 
 
    const maxMedals = d3.max(filteredData, d => d.TotalMedals) || 1;
    const rScale = d3.scaleSqrt()
        .domain([0, maxMedals])
        .range([3, 15]); 
 
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", width)
        .attr("y", 40)
        .attr("fill", "black")
        .style("text-anchor", "end")
        .text("Weight (kg)");

    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("fill", "black")
        .style("text-anchor", "end")
        .text("Height (cm)");

    
    g.selectAll("circle")
        .data(filteredData)
        .join("circle")
        .attr("cx", d => xScale(d.Weight))
        .attr("cy", d => yScale(d.Height))
        .attr("r", d => rScale(d.TotalMedals))
        .attr("fill", "darkorange")
        .attr("opacity", 0.6)
         
        .append("title")
        .text(d => `${d.Name}\nTeam: ${d.Team}\nSport: ${d.Sport}\nHeight: ${d.Height}cm\nWeight: ${d.Weight}kg\nTotal Medals: ${d.TotalMedals}`);
}

function drawBarChart() {
    const svg = d3.select("#bar-svg");
    svg.selectAll("*").remove();  

 
    const margin = { top: 40, right: 30, bottom: 40, left: 120 }; // Large left margin for sport names
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
 
    let filteredData = uniqueAthletes;
    
    if (selectedTeam) {
        filteredData = filteredData.filter(d => d.Team === selectedTeam);
        d3.select("#bar-title").text(`Gender Distribution: ${selectedTeam}`);
    } else {
        d3.select("#bar-title").text(`Gender Distribution: All Teams`);
    }

    if (filteredData.length === 0) return;  

     
    const rollupData = d3.rollups(filteredData,
        v => ({
            M: d3.sum(v, d => d.Sex === 'M' ? 1 : 0),
            F: d3.sum(v, d => d.Sex === 'F' ? 1 : 0)
        }),
        d => d.Sport
    );

 
    const genderData = rollupData.map(d => ({
        sport: d[0],
        M: d[1].M,
        F: d[1].F
    })).sort((a, b) => a.sport.localeCompare(b.sport));
 
    const maxCount = d3.max(genderData, d => Math.max(d.M, d.F)) || 1;

     
    const xScale = d3.scaleLinear()
        .domain([-maxCount, maxCount])
        .range([0, width])
        .nice();

    const yScale = d3.scaleBand()
        .domain(genderData.map(d => d.sport))
        .range([0, height])
        .padding(0.15);
 
    const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(Math.abs);

    g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Number of Athletes");

    g.append("g")
        .call(d3.axisLeft(yScale));
 
    g.append("line")
        .attr("x1", xScale(0))
        .attr("x2", xScale(0))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
 
	
    
    // Male Bars (Left of center)
    g.selectAll(".bar-m")
        .data(genderData)
        .join("rect")
        .attr("class", "bar-m")
        .attr("x", d => d.M > 0 ? Math.min(xScale(0) - 2, xScale(-d.M)) : xScale(0))
        .attr("y", d => yScale(d.sport))
        .attr("width", d => d.M > 0 ? Math.max(2, xScale(0) - xScale(-d.M)) : 0)
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")
        .attr("opacity", d => (!selectedSport || d.sport === selectedSport) ? 1 : 0.2)
        .append("title")
        .text(d => `Male: ${d.M}`);

    // Female Bars (Right of center)
    g.selectAll(".bar-f")
        .data(genderData)
        .join("rect")
        .attr("class", "bar-f")
        .attr("x", xScale(0))
        .attr("y", d => yScale(d.sport))
        .attr("width", d => d.F > 0 ? Math.max(2, xScale(d.F) - xScale(0)) : 0)
        .attr("height", yScale.bandwidth())
        .attr("fill", "tomato")
        .attr("opacity", d => (!selectedSport || d.sport === selectedSport) ? 1 : 0.2)
        .append("title")
        .text(d => `Female: ${d.F}`);

    
    const legend = svg.append("g")
        .attr("transform", `translate(${margin.left}, 10)`);
        
    legend.append("rect").attr("x", 0).attr("y", 0).attr("width", 12).attr("height", 12).attr("fill", "steelblue");
    legend.append("text").attr("x", 18).attr("y", 11).text("Male").style("font-size", "12px");
    
    legend.append("rect").attr("x", 70).attr("y", 0).attr("width", 12).attr("height", 12).attr("fill", "tomato");
    legend.append("text").attr("x", 88).attr("y", 11).text("Female").style("font-size", "12px");
}


function updateDashboard() {
    drawHeatmap();
    drawScatterplot();
    drawBarChart();
}


updateDashboard();

