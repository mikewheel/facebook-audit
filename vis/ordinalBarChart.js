/**
 * ordinalBarChart.js
 *
 * Exposes an interface to draw an Ordinal Bar Chart
 */

/**
 * Helper function for bar chart visualization.
 * Maps natural numbers to x coordinates for rects based on the given margin and spacing information
 * @param n Index of position to create
 * @param total Total number of indices
 * @param rectWidth width of a rect
 * @param graphWidth width of the graph AFTER left and right margins are taken into account
 * @param margin Margin object with four fields: left, right, top, bottom
 */
function calculateBarChartXs(n, total, rectWidth, graphWidth, margin) {
    let rectSpacing = (graphWidth - (rectWidth * total)) / (total + 1);
    return margin.left + rectSpacing * (n + 1) + rectWidth * n + (rectWidth / 2);
}

/**
 * ordinalBarChart
 *
 * Constructs a bar chart visualization with the given data, header and titles.
 * The independent column is assumed to be a list of text labels, and the dependent column is assumed to be numbers
 * @param id The id of the svg into which to render the visualization
 * @param data Data here is assumed to be
 * @param colX The column that is the independent variable
 * @param colY The column that is the dependent variable
 * @param header Header of the graph
 * @param titleX Title of the x axis
 * @param titleY Title of the y axis
 * @param legend Whether or not to include a legend
 */
function ordinalBarChart(id, data, colX, colY, header, width, height, margin, titleX = "", titleY = "", legend = true) {
    // ratio between width of graph and width of the whole visualization
    let graphWidthRatio = 0.8;

    // graph dimensions after margins are taken into account
    let graphHeight = height - margin.top - margin.bottom;
    let graphWidth = (legend ? width * graphWidthRatio : width) - margin.left - margin.right;

    // legend margins
    let legendWidth = legend ? width * (1 - graphWidthRatio) : 0;
    let legendHeight = height;

    // number of bars in the chart
    let numBars = data.length;

    // Tune as necessary or parameterize
    let rectWidth = 100;

    let padding = 30;

    // Construct the graph
    let x = d3.scalePoint()
        .domain(data.map(d => d[colX]))
        .range(natRange(numBars).map(d => calculateBarChartXs(d, numBars, rectWidth, graphWidth, margin)));
    //.range([margin.left, graphWidth + margin.left - rectWidth - padding]);

    let y = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d[colY]))]).nice()
        .range([height - margin.bottom, margin.top]);

    // Function that adds attributes to create the x axis group
    let xAxis = g => g
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(numBars).tickSizeOuter(0));

    // Function that adds attributes to create the y axis group
    let yAxis = g => g
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));
    // .call(g => g.select(".domain").remove())
    // .call(g => g.select(".tick:last-of-type text").clone()
    //     .attr("x", 3)
    //     .attr("text-anchor", "start")
    //     .attr("font-weight", "bold"));

    let svg = d3.select("#" + id)
        .attr("width", width)
        .attr("height", height);

    // border
    svg.append("rect")
        .attr("stroke", "black")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "white");

    // Add graph group
    let graphGroup = svg.append("g");

    // Add x axis
    let xAxisG = graphGroup.append("g")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    svg.append("path")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", `M${margin.left},${height - margin.bottom}h${graphWidth}`);

    // Add y axis
    graphGroup.append("g")
        .call(yAxis);

    graphGroup.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", rectWidth)
        .attr("height", d => height - margin.bottom - y(d[colY]))
        .attr("x", d => {
            console.log(x(d[colX]));
            return x(d[colX]) - rectWidth / 2;
        })
        .attr("y", d => y(d[colY]))
        .attr("fill", "lightblue");

    if (legend) {
        let legendG = svg.append("g");
        constructLegend(legendG, legendWidth, [colX], ["lightblue"], margin, width * graphWidthRatio, 0);
    }
}
