/**
 * Visualizes all the data specified in the event.
 * @param e THe event from the completion of parsing the data (etl-complete).
 */
function handle_error(e) {
    let errorText = e.detail;
    console.log(errorText)
}

/**
 * Visualizes all the data specified in the event.
 * @param e THe event from the completion of parsing the data (etl-complete).
 */
function init_visualization(e) {
    let parsedData = e.detail;
    console.dir(parsedData)
}

function main() {

    let filePicker = document.getElementById("file-picker");
    document.addEventListener('error-triggered', handle_error);
    filePicker.addEventListener('change', unzipFBData);
    document.addEventListener('unzip-complete', etl);
    document.addEventListener('etl-complete', init_visualization);

}

main();