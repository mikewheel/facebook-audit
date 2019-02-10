/**
 * lineCharts.js
 *
 * Author: Sam Xifarasgit
 */


/** FIXME
 * timeSeriesLineChart
 *
 * Function that renders a line chart onto the svg with the given id.
 * This function assumes that an svg with the given id exists
 * @param id the id of the svg
 * @param title title of the chart
 * @param dataObject The data object
 */
function timeSeriesLineChart(id, data, title) {

    let keys = Object.keys(data);
    let colors = [
        "rgb(255, 0, 0)",
        "rgb(0, 255, 0)",
        "rgb(0, 0, 255)",
        "rgb(255, 0, 255)",
        "rgb(0, 255, 255)"
    ];

    // Sort input data
    keys = keys.sort((k1, k2) => {
        function msgCountTotal(k) {
            return data[k].map(e => {
                return e[1]
            }).reduce((c1, c2) => {
                return c1 + c2
            })
        }

        return msgCountTotal(k2) - msgCountTotal(k1)
    }).slice(1, colors.length);

    // Get all dates and all values
    let allDates = [];
    let allValues = [];
    keys.forEach((key) => {
        data[key].forEach((entry) => {
            allDates.push(entry[0]);
            allValues.push(entry[1]);
        });
    });

    // Number of ticks on the X Axis
    let numXAxisTicks = new Set(allDates).size;

    // Get range of dates
    let dateRange = d3.extent(allDates);

    // Select and configure svg
    const svg = d3.select('#' + id)
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    // Function that scales time linearly along the x axis
    let x = d3.scaleTime()
        .domain(dateRange)
        .range([dimensions.marginLeft, dimensions.width - dimensions.marginRight]);

    // Function that scales quantities linearly along the y axis
    let y = d3.scaleLinear()
        .domain([0, d3.max(allValues)])
        .range([dimensions.height - dimensions.marginBottom, dimensions.marginTop]);

    // Function that adds attributes to create the x axis group
    let xAxis = g => g
        .attr("transform", `translate(0, ${dimensions.height - dimensions.marginBottom})`)
        .call(d3.axisBottom(x).ticks(10).tickSizeOuter(0));

    // Function that adds attributes to create the y axis group
    let yAxis = g => g
        .attr("transform", `translate(${dimensions.marginLeft}, 0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold"));

    // Create line function that is used to draw the path
    let line = d3.line()
        .defined(d => {
            console.log(d[1]);
            console.log(y(d[1] + 1));
            return true;
        })
        .x(d => x(d[0]))
        .y(d => y(d[1]))
        .curve(d3.curveMonotoneX);

    // Add x axis
    svg.append("g")
        .call(xAxis);

    // Add y axis
    svg.append("g")
        .call(yAxis);

    // Add title text
    svg.append("text")
        .attr("x", dimensions.width / 2)
        .attr("y", (dimensions.marginTop / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "Helvetica")
        .text(title);

    const radius = 10;

    keys.forEach((key, index) => {
        let lineGroup = svg.append("g");

        // Bind the data and draw the path
        lineGroup.append("path")
            .datum(data[key])
            .attr("fill", "none")
            .attr("stroke", colors[index])
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        lineGroup.selectAll("circle")
            .data(data[key])
            .enter()
            .append("circle")
            .attr("r", radius)
            .attr("fill", colors[index])
            .attr("cx", d => x(d[0]))
            .attr("cy", d => y(d[1]))
    });
}