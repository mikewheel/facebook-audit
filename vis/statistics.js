/**
 * statistics.js
 * Author: Sam Xifaras
 */

/**
 * Renders a big statistic
 * @param text Description text
 * @param number The number to render
 * @param numColor Color of the number to render
 * @param numberOnRight By default the text is rendered to the left and the number to the right. Set this to false to
 *   invert it.
 */
function bigStatistic(text, number, numColor, numberOnRight=true) {
    let svg = d3.select(document.createElementNS(svgNS, "svg"));

    let width = 500;
    let height = 150;

    svg.attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed("svg-content-responsive", true)
        .attr("_initwidth", width)
        .attr("_initheight", height);

    svg.append("text")
        .text(text)
        .attr("x", numberOnRight ? margin.left : width - margin.right)
        .attr("y", height / 2)
        .attr("text-anchor", numberOnRight ? "start" : "end")
        .attr("dominant-baseline", "central")
        .attr("font-size", 16)
        .attr("textLength", (2 * width) / 3);

    svg.append("text")
        .text(number.toString())
        .attr("x", numberOnRight ? width - margin.right : margin.left)
        .attr("y", height / 2)
        .attr("text-anchor", numberOnRight ? "end" : start)
        .attr("dominant-baseline", "central")
        .attr("font-size", 40)
        .attr("font-weight", "bold")
        .attr("fill", numColor);

    return svg.node();
}


/**
 * Generates a visual of a simple random sample of items from some dataset
 * @param data An array of strings to render
 * @param margin A margin object
 * @param numColumns Number of columns to organize the entries into
 *
 * Test: passing
 */
function SRSVisual(data, numColumns) {
    let svg = d3.select(document.createElementNS(svgNS, "svg"));

    let width = 600;
    let height = 400;

    svg.attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed("svg-content-responsive", true)
        .attr("_initwidth", width)
        .attr("_initheight", height);

    let padding = 10;
    let fontSize = 20;

    let numRows = Math.ceil(data.length / numColumns);
    let rowHeight = height / numRows;

    let columnWidth = width / numColumns;
    let textWidthConstraint = columnWidth - (2 * padding);

    console.log(numColumns, numRows);

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

    return svg.node();
}