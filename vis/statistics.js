/**
 * statistics.js
 */

/**
 * Renders a big statistic
 * @param id Id of the svg tag to render it in
 * @param text Description text
 * @param number The number to render
 * @param numColor Color of the number to render
 * @param width Width of the svg
 */
function bigStatistic(id, text, number, numColor, margin) {
    let svg = d3.select("#" + id);

    let width = svg.attr("width");
    let height = svg.attr("height");

    // border
    svg.append("rect")
        .attr("stroke", "black")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "white");

    svg.append("text")
        .text(text)
        .attr("x", margin.left)
        .attr("y", height / 2)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "central")
        .attr("font-size", 16)
        .attr("textLength", (2 * width) / 3);

    svg.append("text")
        .text(number.toString())
        .attr("x", width - margin.right)
        .attr("y", height / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "central")
        .attr("font-size", 40)
        .attr("font-weight", "bold")
        .attr("fill", numColor);

    return svg;
}


/**
 * Generates a visual of a simple random sample of items from some dataset
 * @param id The id of the svg tag into which to render the visual
 * @param data An array of strings to render
 * @param margin A margin object
 * @param numColumns Number of columns to organize the entries into
 */
function SRSVisual(id, data, margin, numColumns) {
    let padding = 10;
    let svg = d3.select("#" + id);

    let fontSize = 20;

    let width = svg.attr("width");
    let height = svg.attr("height");

    let numRows = Math.ceil(data.length / numColumns)
    let rowHeight = height / numRows;

    let columnWidth = width / numColumns;
    let textWidthConstraint = columnWidth - (2 * padding);

    let x = d3.scaleOrdinal()
        .domain(natRange(numColumns))
        .range(natRange(numColumns).map(i => (columnWidth / 2) + i * columnWidth));

    let y = d3.scaleOrdinal()
        .domain(natRange(numRows))
        .range(natRange(numRows).map(i => (rowHeight / 2) + i * rowHeight))

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d, i) => x(i % numColumns))
        .attr("y", (d, i) => y(Math.floor(i / numColumns)))
        .style("opacity", 0.0)
        .attr("font-size", 0)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text(d => d)
        //.call(wrap, columnWidth) TODO: Find out how to do text wrapping
        .transition("opacity")
        .duration(500)
        .delay((d, i) => i * 100)
        .style("opacity", 1.0)
        .transition("fontSize")
        .ease(d3.easeBounce)
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr("font-size", fontSize);

    return svg;
}