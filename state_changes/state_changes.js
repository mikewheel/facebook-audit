// Defines functions that control the <main> element in the webpage by inserting and removing DOM elements.


/**
 * Displays a loading page to be shown in between the input page and the visualization page.
 */
function displayLoadingPage(e) {
    eraseMain();
    let loadingHTML = `
    <div class="container-fluid">
        <div class="row d-flex justify-content-center">
            <div class="col-12 col-md-4">
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
        </div>
    </div>`;
    document.getElementById("main").innerHTML = loadingHTML;
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