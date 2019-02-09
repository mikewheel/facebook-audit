/**
 * JavaScript that explores the feasibility of using Indexed DB tables to store and retrieve the user's Facebook data.
 * Written by Michael Wheeler, using example code from "Client-Side Data Storage" by Raymond Camden.
 */

function idbOK() {
    /**
     * Checks whether IndexedDB is supported by the browser. Taken from "Client-Side Data Storage".
     */
    return "indexedDB" in window && !/iPad|iPhone|iPod/.test(navigator.platform);
}

console.log(idbOK());
