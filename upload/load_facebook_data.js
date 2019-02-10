/**
 * Allows the webpage to accept and decompress a zip file of Facebook data, recognize the JSON files and read them using
 * JSON.parse(), and then compile all the resulting JSON objects into a single object for export.
 */

zip.workerScriptsPath = "./lib/";

/**
 * Unzips the data from the uploaded zip file.
 * @param e - the change event on the file input.
 */
function unzipFBData(e) {

    let filePicker = e.target;

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

                    // First pull out all the JSON entries in the zip file and store them in a separate list
                    for (let i = 0; i < entries.length; i++) {
                        let entry = entries[i];
                        // If that entry is a JSON file
                        if (!entry.directory && entry.filename.endsWith(".json")) {
                            JSONEntries.push(entry);
                        }
                    }

                    console.log(JSONEntries.length, " JSON entries out of", entries, "total entries.");
                    if (JSONEntries.length === 0) {
                        let event = new CustomEvent("error-triggered",
                            { detail: "No JSON found in zip!" });
                        document.dispatchEvent(event);
                    }

                    // this is the mapping from filenames (and their place in
                    // the directory structure to their json bodies
                    let filenameJsonMap = {};

                    // Then go through that list of only JSON entries and extract the data
                    for (let i = 0; i < JSONEntries.length; i++) {
                        let entry = JSONEntries[i];

                        // Generate an array of filepath components by splitting on slash
                        const path = entry.filename.split("/");
                        // Then filename is the last item in that list
                        const filename = path[path.length - 1];
                        // And directory structure is everything that comes before
                        const directoryNames = path.slice(0, -1);

                        // Get the raw data from the selected zip entries
                        entry.getData(new zip.TextWriter(),
                            function (text) {
                                // console.log(entry.filename, ": contents acquired!");

                                // this will be the dictionary in dirPart that
                                // corresponds to the directory the file is in
                                let dirPart = filenameJsonMap;

                                // For each directory leading up to the filename
                                for (const dir of directoryNames) {
                                    // Ensure there's an object at the key for that directory
                                    dirPart[dir] = dirPart[dir] || {};
                                    // And then move down the directory tree
                                    dirPart = dirPart[dir];
                                }
                                // By this point we've reached the location where the file contents should go
                                // So parse the JSON from the file and store it there
                                dirPart[filename] = JSON.parse(text);

                                completedJSON++;

                                if (completedJSON === JSONEntries.length) {
                                    //var rawData = dirPart;
                                    let event = new CustomEvent("unzip-complete", { detail: filenameJsonMap });
                                    document.dispatchEvent(event);
                                }

                            }, function (current, total) {
                                // Used to measure progress of getting data from zip entries
                                // Here we write percents to console.
                                // let percent_progress = Math.floor((100 * current) / total);
                                // if (percent_progress % 20 === 0) {
                                //     console.log(entry.filename, ": Progress is ", percent_progress, "% (",
                                //         current, " out of ", total, ")");
                                // }
                                //return;
                            }
                        );
                    }
                } else {
                    console.log("No entries in the zip file!");
                    let errorEvent = new CustomEvent("error-triggered",
                        { detail: "No entries were contained in the zip file!" });
                    document.dispatchEvent(errorEvent);
                }
            });
        },
        function (error) {
            let errorEvent = new CustomEvent("error-triggered", { detail: "Could not read in ZIP file!" });
            document.dispatchEvent(errorEvent);
            console.log(JSON.stringify(error));
        });
};
