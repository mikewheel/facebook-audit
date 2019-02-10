/**
 * visualization.js
 * This file exposes functions for visualizing statistics derived from Facebook data
 */


const FAKEBOOKBLUE = "#4267b2";
const svgNS = "http://www.w3.org/2000/svg";

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
    visuals.push({
      "time-on-platform": bigStatistic("You have been giving Facebook data since",
          new Date(parsedData["profile_information"]["profile"]["registration_timestamp"] * 1000).toDateString(),
          FAKEBOOKBLUE)
    });

    visuals.push({
      "advertisers-count": bigStatistic("Number of advertisers individually targeting you",
          parsedData["ads"]["targeting_advertisers"].length,
          FAKEBOOKBLUE)
    });

    visuals.push({
      "ad-category-count": bigStatistic("Facebook thinks you are likely to click ads in this many areas",
          parsedData["ads"]["ad_interests"].length,
          FAKEBOOKBLUE)
    });

    visuals.push({
      "messages-count": bigStatistic("You have sent this many messages, Facebook saves the content of each",
          parsedData["messages"].length,
          FAKEBOOKBLUE)
    });

    visuals.push({
      "group-membership-count": bigStatistic("You are a member of this many groups, each of them has associated stored info",
          parsedData["groups"]["group_memberships"].length,
          FAKEBOOKBLUE)
    });

    visuals.push({
      "former-friends": bigStatistic("I don't know what they did to piss you off, but you unfriended this many people",
          parsedData["friends"]["former_friends"].length,
          FAKEBOOKBLUE)
    });

    visuals.push({
      "rejected-friend-requests": bigStatistic("Too good to add these people? Number of rejected friend requests",
          parsedData["friends"]["requests_you_rejected"].length,
          FAKEBOOKBLUE)
    });

    // SRS of advertisers
    visuals.push({
      "ad-category-srs": SRSVisual(getRandomSubarray(parsedData["ads"]["targeting_advertisers"], 12), 1)
    });

    visuals.push({
      "apps-srs": SRSVisual(getRandomSubarray(parsedData["apps"], 9), 1)
    });

    visuals.push({
      "event-attendance": ordinalBarChart([{
        "status": "Accepted",
        "count": parsedData["events"]["accepted"].length
      },
        {
          "status": "Declined",
          "count": parsedData["events"]["declined"].length
        },
        {
          "status": "Hosted",
          "count": parsedData["events"]["hosted"].length
        },
        {
          "status": "Interested",
          "count": parsedData["events"]["interested"].length
        }],
          "status",
          "count",
          FAKEBOOKBLUE,
          "Your Responses to Events",
          "",
          "",
          false)
    });

    visuals.push({
      "messages-srs": SRSVisual(getRandomSubarray(parsedData["messages"], 12).map(d => d.content),
          4)
    });

    visuals.push({
      "friends-over-time": ordinalBarChart(friendsSplitByYear(parsedData["friends"]["friends"]), "year", "count",
          FAKEBOOKBLUE, "Friends Made per Year", "","", false)
    });

    visuals.push({
      "apps-count": bigStatistic("Number of apps linked to Facebook",
          parsedData["apps"].length)
    });

    visuals.push({
      "friends-count": bigStatistic("Number of friends",
          parsedData["friends"]["friends"].length,
          FAKEBOOKBLUE,
          false)
    });

    visuals.push({
      "reactions-count": bigStatistic("Reactions to posts",
          parsedData["reactions"]["posts_and_comments"].length + parsedData["reactions"]["pages"].length,
          FAKEBOOKBLUE,
          false)
    });

    visuals.push({
      "posts-count": bigStatistic("Number of posts",
          parsedData["posts"].length,
          FAKEBOOKBLUE,
          false)
    });

    visuals.push({
      "comments-count": bigStatistic("Comments on posts",
          parsedData["comments"].length,
          false)
    });

    let event = new CustomEvent("visuals-created", { detail: visuals });
    document.dispatchEvent(event);
  } catch (error) {
    throw error;
    let errorEvent = new CustomEvent("error-triggered", { detail: "Error creating graphics!" });
    document.dispatchEvent(errorEvent);
    console.log(JSON.stringify(error));
  }
}

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
  /*let svg = ordinalBarChart(
      exampleData,
      "year",
      "numFriends",
      FAKEBOOKBLUE,
      "",
      titleX="",
      titleY="",
      legend = false);
  document.getElementById("insert").appendChild(svg); // This div must also be classed with svg-container
*/

  let svg = ordinalBarChart([{
        "status": "Accepted",
        "count": parsedData["events"]["accepted"].length
      },
        {
          "status": "Declined",
          "count": parsedData["events"]["declined"].length
        },
        {
          "status": "Hosted",
          "count": parsedData["events"]["hosted"].length
        },
        {
          "status": "Interested",
          "count": parsedData["events"]["interested"].length
        }],
      "status",
      "count",
      FAKEBOOKBLUE,
      "",
      "",
      "",
      false);

  document.getElementById("insert").appendChild(svg);

/*
  let svg = addBorder(bigStatistic("NUMBER OF ADVERTISERS TARGETING YOU", 1040, "#4267b2", margin, 600, 100));
  document.getElementById("insert").appendChild(svg); // This div must also be classed with svg-container


  let svg = addBorder(SRSVisual(["hello", "world", "this", "is", "a", "test"], 1));
  document.getElementById("insert").appendChild(svg); // This div must also be classed with svg-container */
}
