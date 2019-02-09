/**
 * Allows the webpage to accept and decompress a zip file of Facebook data, recognize the JSON files and read them using
 * JSON.parse(), and then compile all the resulting JSON objects into a single object for export.
 */
zip.workerScriptsPath = "./lib/";

let filePicker = document.getElementById("file-picker");
filePicker.addEventListener('change', function () {
    // First extract the File object from the input form field
    let zipFileBlob = filePicker.files[0];
    console.log("Received the file: ", zipFileBlob.name);

    // Then create the Reader that will handle extracting the data from that file
    zip.createReader(new zip.BlobReader(zipFileBlob),
        function (reader) {
            // Get all entries from the zip file
            reader.getEntries(function (entries) {
                // If there are one or more entries
                if (entries.length) {

                    console.log(entries.length, " entries in this zip file.");

                    let JSONEntries = [];  // List to contain only the JSON entries
                    let completedJSON = 0;  // Counter for the number of JSON that we've completed
                    let numCompletions = 0;  // This lets us check that the all-complete condition is met only once

                    // First pull out all the JSON entries in the zip file and store them in a separate list
                    for (let i = 0; i < entries.length; i++) {
                        let entry = entries[i];
                        // If that entry is a JSON file
                        if (!entry.directory && entry.filename.endsWith(".json")) {
                            JSONEntries.push(entry);
                        }
                    }

                    console.log(JSONEntries.length, " JSON entries out of", entries, "total entries.");

                    // Then go through that list of only JSON entries and extract the data
                    for (let i = 0; i < JSONEntries.length; i++) {
                        let entry = JSONEntries[i];
                        // Get the raw data from the selected zip entries
                        entry.getData(new zip.TextWriter(),
                            function (text) {
                                console.log(entry.filename, ": contents acquired!");

                                completedJSON++;
                                if (completedJSON === JSONEntries.length) {
                                    numCompletions++;
                                    console.log("COMPLETE!!!", completedJSON, "out of", JSONEntries.length, "(",
                                        numCompletions, ")");
                                }

                                // TODO -- add JSON to global object
                                JSON.parse(text);

                            }, function (current, total) {
                                // Used to measure progress of getting data from zip entries
                                // Here we write percents to console.
                                let percent_progress = Math.floor((100 * current) / total);
                                if (percent_progress % 20 === 0) {
                                    console.log(entry.filename, ": Progress is ", percent_progress, "% (",
                                        current, " out of ", total, ")");
                                }
                            }
                        );
                    }
                } else {
                    console.log("No entries in the zip file!");
                    throw new Error("No entries in zip file!")
                }
            });
        },
        function (error) {
            console.log("Could not read in ZIP file!");
            console.log(JSON.stringify(error));
    });
});
