/**
 * Re-renders the start page in the event of an error and displays a modal indicating the nature of the error.
 * @param e The error event (error-triggered).
 */
function handle_error(e) {
    let errorText = e.detail;
    console.log(errorText)
}

/**
 * Converts the parsed data from etl function to several visualization-specific JavaScript objects.
 * @param e The event from the completion of parsing the data (etl-complete).
 */
function match_signatures(e) {
    let parsedData = e.detail;
    console.dir(parsedData)
}

function main() {
    let filePicker = document.getElementById("file-picker");

    document.addEventListener('error-triggered', handle_error); // Any error occurs -> Go back to main page
    filePicker.addEventListener('change', unzipFBData); // File uploaded -> unzip the file
    // filePicker.addEventListener('change', switchToLoadingScreen); // File uploaded -> display loading screen
    document.addEventListener('unzip-complete', etl); // Unzip complete -> prune and extract
    document.addEventListener('etl-complete', match_signatures); // Extraction complete -> meet viz signatures
    // document.addEventListener('viz-data-ready', switchToVizScreen); // Signatures met -> display empty viz screen
    // document.addEventListener('viz-screen-ready', callAllD3) // Empty Visualization screen ready -> call D3 on DOM

}

// TODO -- only run main() when the browser says it's ready
main();
