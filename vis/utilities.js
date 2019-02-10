/**
 * utilities.js
 *
 * 
 */



/**
 * Constructs a legend on a graph
 * @param parent The parent node to append the legend onto
 * @param width Width in which to render the legend
 * @param keys Array of keys
 * @param colors Array of colors
 * @param margin Margin object
 * @param offsetX The x of the top left corner of the legend box
 * @param offsetY The y of the top left corner of the legend box
 */
function constructLegend(parent, width, keys, colors, margin, offsetX, offsetY) {
    let rectWidth = 30;
    let padding = 10;

    parent.selectAll("g")
        .data(keys)
        .enter()
        .append("g")
        .each(function(d, i) {
            let elem = d3.select(this);
            elem.append("rect")
                .attr("fill", colors[i])
                .attr("width", 20)
                .attr("height", 20)
                .attr("x", offsetX + margin.left)
                .attr("y", offsetY + margin.top + i * rectWidth + i * padding - rectWidth / 2);

            elem.append("text")
                .attr("x", offsetX + width - margin.right)
                .attr("y", offsetY + margin.top + i * rectWidth + i * padding)
                .attr("text-anchor", "end")
                .text(d);
        });
}
