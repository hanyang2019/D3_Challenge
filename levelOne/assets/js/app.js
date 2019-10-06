
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(acsData) {
     console.log(acsData);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
        acsData.forEach(d=> {
        d.healthcare = +d.healthcare;
        d.poverty = +d.poverty;
        console.log(d);
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(acsData, d => d.poverty)*0.9,d3.max(acsData, d => d.poverty)*1.05])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(acsData, d => d.healthcare)*0.8,d3.max(acsData, d => d.healthcare)*1.05])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(acsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("class","stateCircle")
    .attr("opacity", ".5");

    // Step 6: Create text for each circle to display state abbr
    // ======================================
    var circlesText = chartGroup.append("g").selectAll("text") //append a <g> to hold all <text> otherwise some circles would not have a text
    .data(acsData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare*0.99)) //to make the text in the center of the circle
    .classed("stateText",true)
    .style("font-size","9px")
    .text(d=>`${d.abbr}`);
    

    // Step 7: Create axes labels
    // ========================================
    // Y axis label
    chartGroup.append("text")
      .attr("transform","translate(-70,210) rotate(-90)")
      .attr("text-anchor","middle")
      .attr("dy", "1em")
      .text("Lacks Healthcare (%)");

    // X axis label
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)")
      .attr("text-anchor","middle");
  }).catch(function(error) {
    console.log(error);
  });
