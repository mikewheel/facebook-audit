/**
 * statistics.js
 * Author: Sam Xifaras
 */

/**
 * Creates a blank SVG to be shown when there is no data for a visualization
 */
function blankSVG() {
    let svg = d3.select(document.createElementNS(svgNS, "svg"));

    let width = 500;
    let height = 150;

    svg.attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed("svg-content-responsive", true)
        .attr("_initWidth", width)
        .attr("_initHeight", height);

    svg.append("text")
        .text("No data to show")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", 16);

    return svg.node();
}

/**
 * Renders a big statistic
 * @param text Description text
 * @param number The number to render
 * @param numColor Color of the number to render
 * @param numberOnRight By default the text is rendered to the left and the number to the right. Set this to false to
 *   invert it.
 */
function bigStatistic(text, number, numColor, numberOnRight=true) {
    let div = d3.select(document.createElement("div"));

    div.classed("d-flex", true)
        .classed("justify-content-between", true);

    div.append("h4")
        .text(text);

    div.append("p")
        .text(number)
        .style("font-size", "3em")
        .style("color", "#4267b2");


    return div.node();
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
    let div = d3.select(document.createElement("div"));

    div.append("h5")
        .text("Examples of above:");

    div.append("ul")
        .classed("list-group", true)
        .selectAll("li").data(data).enter()
        .append("li")
          .classed("list-group-item", true)
          .html(function (d) {
              return d;
          });

    return div.node();
}