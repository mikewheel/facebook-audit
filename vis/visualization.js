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


const FAKEBOOKBLUE = "#4267b2";

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

  let svg = bigStatistic("NUMBER OF ADVERTISERS TARGETING YOU", 1040, "#4267b2", margin, 600, 100);
  document.getElementById("insert").appendChild(svg);

  //addBorder(SRSVisual("stat-ads", ["hello", "world", "this", "is", "a", "test"], margin, 4));
}