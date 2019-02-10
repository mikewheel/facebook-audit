/**
 * Re-renders the start page in the event of an error and displays a modal indicating the nature of the error.
 * @param e The error event (error-triggered).
 */
function handle_error(e) {
    let errorText = e.detail;
    console.log(errorText);
    // Display an alert describing the nature of the error
    alert(errorText);
    location.reload();
}

/**
 * Converts the parsed data from etl function to several visualization-specific JavaScript objects.
 * @param e The event from the completion of parsing the data (etl-complete).
 */
function main() {
    let filePicker = document.getElementById("file-picker");

    document.addEventListener('error-triggered', handle_error); // Any error occurs -> Go back to main page
    filePicker.addEventListener('change', unzipFBData); // File uploaded -> unzip the file
    filePicker.addEventListener('change', displayLoadingPage); // File uploaded -> display loading screen
    document.addEventListener('unzip-complete', etl); // Unzip complete -> prune and extract
    document.addEventListener('etl-complete', create_visuals); // Extraction complete -> create visualizations
    document.addEventListener('visuals-created', displayVizPage); // Signatures met -> display the viz screen

}

// TODO -- only run main() when the browser says it's ready
main();
