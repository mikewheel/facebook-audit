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
    eraseMain();
    let main = document.getElementById("main");
    let vizTemplateHTML = `<div class="row">
          <div class="col-12" id="advertisers-count">
            <div class="svg-container"></div>
          </div>
        </div>

        <div class="row">
          <div class="col-12" id="ad-category-count">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="ad-category-srs">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="time-on-platform">
            <div class="svg-container"></div>
          </div>
        </div>

        <div class="row">
          <div class="col-12" id="reactions-count">
            <div class="svg-container"></div>
          </div>
        </div>

        <div class="row">
          <div class="col-12" id="comments-count">
            <div class="svg-container"></div>
          </div>
        </div>

        <div class="row">
          <div class="col-12" id="posts-count">
            <div class="svg-container"></div>
          </div>
        </div>

        <div class="row">
          <div class="col-12" id="messages-count">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="messages-srs">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="friends-count">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="apps-count">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="apps-srs">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="group-membership-count">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="event-attendance">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="former-friends">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="rejected-friend-requests">
            <div class="svg-container"></div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12" id="conclusion">
            <h3>Would you like to <a href="https://www.facebook.com/help/delete_account/">delete your account?</a></h3>
            <p>Created by  Daniel Rassaby, Sam Xifaras, Michael Wheeler, and Julian Zucker</p>
          </div>
        </div>`;

    main.innerHTML = vizTemplateHTML;
    // TODO -- inject the D3 by IDs
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