/**
 * visualization.js
 * This file exposes functions for visualizing statistics derived from Facebook data
 */


/**
 * Converts the parsed data from etl function to several visualization-specific JavaScript objects.
 * @param e The event from the completion of parsing the data (etl-complete).
 */
function create_visuals(e) {
  try {
    let parsedData = e.detail;
    console.dir(parsedData);
    var visuals = []; // to be inserted directly in the page, format: [{id: dom}, ...]


    // CREATING THE VISUALIZATIONS
    // visuals.push({
    //   "num-advertisers": bigStatistic("Number of advertisers individually targeting you",
    //   parsedData["targeting_advertisers"].length)
    // });

    // TODO: ACTUALLY CREATE VISUALS

    let event = new CustomEvent("visuals-created", { detail: visuals });
    document.dispatchEvent(event);
  } catch (error) {
    let errorEvent = new CustomEvent("error-triggered", { detail: "Error creating graphics!" });
    document.dispatchEvent(errorEvent);
    console.log(JSON.stringify(error));
  }
}

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

  // Render
  let svg = ordinalBarChart(
      exampleData,
      "year",
      "numFriends",
      FAKEBOOKBLUE,
      "",
      titleX="",
      titleY="",
      legend = false);
  document.getElementById("insert").appendChild(svg); // This div must also be classed with svg-container


/*
  let svg = addBorder(bigStatistic("NUMBER OF ADVERTISERS TARGETING YOU", 1040, "#4267b2", margin, 600, 100));
  document.getElementById("insert").appendChild(svg); // This div must also be classed with svg-container


  let svg = addBorder(SRSVisual(["hello", "world", "this", "is", "a", "test"], 1));
  document.getElementById("insert").appendChild(svg); // This div must also be classed with svg-container */
}