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
    let height = svg.attr("height")

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
}


/**
 * Generates a visual of a simple random sample of items from some dataset
 * @param id The id of the svg tag into which to render the visual
 * @param data An array of strings to render
 * @param margin A margin object
 */
function SRSVisual(id, data, margin) {
    let svg = d3.select("#" + id);
}