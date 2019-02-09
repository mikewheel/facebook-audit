// Mock Data for testing purposes
const mockData = {
  "messages_viz": {
    "Sam": [
      [new Date('Sun, 08 Apr 2018'), 10],
      [new Date('Sun, 09 Apr 2018'), 20],
      [new Date('Sun, 10 Apr 2018'), 5],
      [new Date('Sun, 11 Apr 2018'), 70],
      [new Date('Sun, 12 Apr 2018'), 100]
    ],
    "Dave": [
      [new Date('Sun, 09 Apr 2018'), 10],
      [new Date('Sun, 10 Apr 2018'), 40],
      [new Date('Sun, 11 Apr 2018'), 2],
      [new Date('Sun, 12 Apr 2018'), 60],
      [new Date('Sun, 13 Apr 2018'), 10]
    ]
  }
};

/*
 * Global object with dimension data for rendering
 */
const dimensions = {
  width: 1000,
  height: 600,
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
 * - keys: array of keys whose data to render
 * - colors: array of colors of each line, corresponding to the keys
 * - title: title of the chart
 * - messageDataObject: The data object
 */
function chart(id, title, dataObject) {
  const messagesData = dataObject["messages_viz"];

  let keys = Object.keys(messagesData);
  let colors = [
    "rgb(0, 0, 255)",
    "rgb(0, 0, 205)",
    "rgb(0, 0, 155)",
    "rgb(0, 0, 105)",
    "rgb(0, 0, 55)"
  ];

  // Sanity checking of inputs
  keys = keys.sort((k1, k2) => {
    function msgCountTotal(k) {
      return messagesData[k].map(e => {
        return e[1]
      }).reduce((c1, c2) => {
        return c1 + c2
      })
    }
    return msgCountTotal(k2) - msgCountTotal(k1)
  }).slice(1, colors.length)

  console.log(keys)



  // Get all dates and all values
  let allDates = [];
  let allValues = [];
  keys.forEach((key) => {
    messagesData[key].forEach((entry) => {
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
      .call(d3.axisBottom(x).ticks(numXAxisTicks).tickSizeOuter(0));

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
      .x(d => {
        return x(d[0])
      })
      .y(d => {
        return y(d[1])
      });

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


  keys.forEach((key, index) => {
    // Bind the data and draw the path
    svg.append("path")
        .datum(messagesData[key])
        .attr("fill", "none")
        .attr("stroke", colors[index])
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
  });
};

/*
 * Renders all visualizations
 */
function renderVisualizations(data) {
  // TODO: Import data from ETL stage
  chart("messages_viz", "Messages", data);
}