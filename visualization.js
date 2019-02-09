
// Mock Data for testing purposes
var mockData = {
    "messages_viz" : {
        "Sam" : [
            [new Date('Sun, 08 Apr 2018'), 10],
            [new Date('Sun, 09 Apr 2018'), 20],
            [new Date('Sun, 10 Apr 2018'), 5],
            [new Date('Sun, 11 Apr 2018'), 70],
            [new Date('Sun, 12 Apr 2018'), 100]
        ]
    }
};

/*
 * Global object with dimension data for rendering
 */
const dimensions = {
    width: 1000,
    height: 800,
    marginLeft: 50,
    marginRight: 20,
    marginTop: 100,
    marginBottom: 40
};

/*
 * Function that renders a line chart onto the svg with the given id.
 * This function assumes that an svg with the given id exists
 * Parameters:
 * - id: the id of the svg
 * - name: name of the person
 * - title: title of the chart
 * - messageDataObject: The data object
 */
function chart(id, name, title, dataObject) {
    const data = dataObject[name];

    // Select and configure svg
    const svg = d3.select('#' + id)
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    //
    let x = d3.scaleTime()
        .domain(d3.extent(data, d => d[0]))
        .range([dimensions.marginLeft, dimensions.width - dimensions.marginRight]);

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([dimensions.height - dimensions.marginBottom, dimensions.marginTop]);

    // Function that adds attributes to create the x axis group
    let xAxis = g => g
        .attr("transform", `translate(0, ${dimensions.height - dimensions.marginBottom})`)
        .call(d3.axisBottom(x).ticks((dimensions.width - (dimensions.marginLeft + dimensions.marginRight)) / 80).tickSizeOuter(0));

    // Function that adds attributes to create the y axis group
    let yAxis = g => g
        .attr("transform", `translate(${dimensions.marginLeft}, 0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold"));

    // Add x axis
    svg.append("g")
        .call(xAxis);

    // Add y axis
    svg.append("g")
        .call(yAxis);

    // Add title tex
    svg.append("text")
        .attr("x", dimensions.width / 2)
        .attr("y", (dimensions.marginTop / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "Helvetica")
        .text(title);

    // Create line function that is used to draw the path
    let line = d3.line()
        .defined(d => !isNaN(d[1]))
        .x(d => x(d[0]))
        .y(d => y(d[1]));

    // Bind the data and draw the path
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
};

/*
 * Renders all visualizations
 */
function renderVisualizations() {
    // TODO: Import data from ETL stage
    chart("messages_viz", "Sam", "Messages", mockData.messages_viz);
}