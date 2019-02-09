/**
 * Allows the webpage to accept and decompress a zip file of Facebook data, recognize the JSON files and read them using
 * JSON.parse(), and then compile all the resulting JSON objects into a single object for export.
 */
zip.workerScriptsPath = "../extraction_prototype/lib/";

let filePicker = document.getElementById("file-picker");

// a worker that can do the ETL tasks in a separate thread.
const etlWorker = new Worker("../etl/etl_from_fb_json.js");

// the function to call on the data, once it's loaded
let dataCallback = function (d) {
  console.log("calling back with " + JSON.stringify(d));
  etlWorker.postMessage(d)
};

// bind a handler that will process the worker's response
etlWorker.onmessage = function(messageEvent) {
  console.log("received response from worker: " + JSON.stringify(messageEvent));
  renderVisualizations(messageEvent.data)
};

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

            // this is the mapping from filenames (and their place in
            // the directory structure to their json bodies
            let filenameJsonMap = {};

            for (let i = 0; i < entries.length; i++) {

              let entry = entries[i];
              if (!entry.directory && entry.filename.endsWith(".json")
                  && !entry.filename.startsWith("__MACOSX")
              // && entry.filename.startsWith("messages/inbox"))
              ) {

                // setup the "dirForFile" object, so we can store JSON in there with the callback
                const path = entry.filename.split("/");
                // all but last element, last element respectively
                const directories = path.slice(0, -1);
                const filename = path[path.length - 1];

                totalJSON++;

                // Get the raw data from the selected zip entries
                console.log("Getting the data for entry", i, ":", entry.filename);

                entry.getData(new zip.TextWriter(),
                    function (text) {
                      // console.log("Text of file" + entry.filename + ":" + text.slice(0, 100));

                      let pathSoFar = [];
                      // this will be the dictionary in dirPart that
                      // corresponds to the directory the file is in
                      let dirPart = filenameJsonMap;
                      for (const dir of directories) {
                        dirPart[dir] = dirPart[dir] || {};
                        dirPart = dirPart[dir];
                      }
                      dirPart[filename] = JSON.parse(text);


                      completedJSON++;
                      if (completedJSON === totalJSON) {
                        console.log("COMPLETE!!!", completedJSON, "out of", totalJSON);

                        dataCallback(filenameJsonMap)
                      }
                    }, function (current, total) {
                      // Used to measure progress of getting data from zip entries
                      // For like a progress bar or something
                      if (current === total) {
                        // console.log(entry.filename, ": Progress is ", current, " out of ", total);
                      }
                      if (completedJSON === totalJSON) {
                        console.log(filenameJsonMap)
                        dataCallback(filenameJsonMap)
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
