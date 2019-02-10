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


function visualize(id, data, method) {
  switch (method) {
    case "ordinalBarChart":
      break;
  }
}


function render() {
  let margin = {
    top: 40,
    left: 40,
    bottom: 40,
    right: 40
  };
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

  //bigStatistic("stat-ads", "NUMBER OF ADVERTISERS TARGETING YOU", 1040, "#4267b2", margin);

  addBorder(SRSVisual("stat-ads", ["hello", "world", "this", "is", "a", "test"], margin, 4));
}