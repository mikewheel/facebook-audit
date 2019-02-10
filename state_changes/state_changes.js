// Defines functions that control the <main> element in the webpage by inserting and removing DOM elements.


/**
 * Displays a loading page to be shown in between the input page and the visualization page.
 */
function displayLoadingPage(e) {
    eraseMain();
    let loadingHTML = `<div class="row d-flex justify-content-center">
    <div class="col-12">
      <div class="d-flex align-items-center flex-column">
        <h1>Please be patient.</h1>
        <div>
          <iframe src="https://giphy.com/embed/131tNuGktpXGhy" width="100px" height="100px"
                  frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
        </div>
        <p>
          We put your privacy first, so none of your data ever reaches us. This means that your browser will
          run a little slower while it processes the files -- just hang tight.
        </p>
      </div>
    </div>
  </div>`;
    document.getElementById("main").innerHTML = loadingHTML;
}

/**
 * Displays the visualization page to be shown after loading is complete.
 */
function displayVizPage(e) {
    let visuals = e.detail;

    eraseMain();
    let main = document.getElementById("main");
    let vizTemplateHTML = `
        <div class="row viz-row">
          <div class="col-12">
            <div id="time-on-platform"></div>
          </div>
        </div>

        <div class="row viz-row">
          <div class="col-12">
            <div id="advertisers-count"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div id="ad-category-count"></div>
          </div>
        </div>

        
        <div class="row viz-row">
          <div class="col-12">
            <div id="ad-category-srs"></div>
          </div>
        </div>

        <div class="row viz-row">
          <div class="col-12">
            <div id="reactions-count"></div>
          </div>
        </div>

        <div class="row viz-row">
          <div class="col-12">
            <div id="comments-count"></div>
          </div>
        </div>

        <div class="row viz-row">
          <div class="col-12">
            <div id="posts-count"></div>
          </div>
        </div>

        <div class="row viz-row">
          <div class="col-12">
            <div id="messages-count"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div id="messages-srs"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div id="friends-count"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div class="svg-container" id="friends-over-time"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div id="apps-count"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div id="apps-srs"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div id="group-membership-count"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div class="svg-container" id="event-attendance"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div id="former-friends"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12">
            <div id="rejected-friend-requests"></div>
          </div>
        </div>
        
        <div class="row viz-row">
          <div class="col-12" id="conclusion">
            <h3>Would you like to <a href="https://www.facebook.com/help/delete_account/">delete your account?</a></h3>
            <p>Created by  Daniel Rassaby, Sam Xifaras, Michael Wheeler, and Julian Zucker</p>
          </div>
        </div>`;
    main.innerHTML = vizTemplateHTML;

    window.setTimeout(function() {
        visuals.forEach(function(vizObject) {
            let htmlID = Object.keys(vizObject)[0];
            let node = vizObject[htmlID];
            console.log(htmlID);
            document.getElementById(htmlID).appendChild(node);
        })
    }, 500);

}

/**
 * Removes all children of the <main> tag.
 */
function eraseMain() {
    let main = document.getElementById("main");
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}