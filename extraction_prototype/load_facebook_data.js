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
            // Get all entries from the zip
            reader.getEntries(function (entries) {
                // If we have entries in our zip file
                if (entries.length) {
                    console.log(entries.length, " entries in this zip file.");
                    let totalJSON = 0;
                    let completedJSON = 0;
                    for (let i = 0; i < entries.length; i++) {

                        let entry = entries[i];
                        if (!entry.directory && entry.filename.endsWith(".json")
                            && entry.filename.startsWith("messages/inbox")) {
                            totalJSON++;
                            // Get the raw data from the selected zip entries
                            console.log("Getting the data for entry", i, ":", entry.filename);
                            entry.getData(new zip.TextWriter(),
                                function (text) {
                                    // TODO -- do something more meaningful with file text
                                    console.log("Text of file", entry.filename, ":");
                                    console.log(text);
                                    completedJSON++;
                                    if (completedJSON === totalJSON) {
                                        console.log("COMPLETE!!!", completedJSON, "out of", totalJSON);
                                    }
                                }, function (current, total) {
                                    // Used to measure progress of getting data from zip entries
                                    // For like a progress bar or something
                                    if (current === total) {
                                        console.log(entry.filename, ": Progress is ", current, " out of ", total);
                                    }
                                }
                            );
                        }
                    }
                } else {
                    console.log("No entries in zip file!") // FIXME -- raise error
                }
            });
        },
        function (error) {
            console.log("Could not read in ZIP file!");
            console.log(JSON.stringify(error));
    });
});
