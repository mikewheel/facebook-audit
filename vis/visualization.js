/**
 * visualization.js
 * Author: Sam Xifaras
 *
 * This file exposes functions for visualizing statistics derived from Facebook data
 */

/*
 * Data format expected by this file:
 * Array of objects of key value pairs.
 * For example:
 * To visualize FB friends each year as a bar chart, the data should look like this:
 */

// Constants
const FAKEBOOKBLUE = "#4267b2";
const svgNS = "http://www.w3.org/2000/svg";

let exampleData = [
  {
    "year" : 2014,
    "numFriends" : 204
  },
  {
    "year" : 2015,
    "numFriends" : 214
  }
];

function render() {
/*
  // Render
  ordinalBarChart("viz",
      exampleData,
      "year",
      "numFriends",
      "",
      800,
      600, margin,
      titleX="",
      titleY="",
      legend = true);*/

/*
  let svg = addBorder(bigStatistic("NUMBER OF ADVERTISERS TARGETING YOU", 1040, "#4267b2", margin, 600, 100));
  document.getElementById("insert").appendChild(svg); // This div must also be classed with svg-container
*/

  let svg = addBorder(SRSVisual(["hello", "world", "this", "is", "a", "test"], 1));
  document.getElementById("insert").appendChild(svg); // This div must also be classed with svg-container
}