/**
 * Allows the webpage to accept and decompress a zip file of Facebook data, recognize the JSON files and read them using
 * JSON.parse(), and then compile all the resulting JSON objects into a single object for export.
 */

var yauzl = require("yauzl");

