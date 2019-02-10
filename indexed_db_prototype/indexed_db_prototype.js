/**
 * JavaScript that explores the feasibility of using Indexed DB tables to store and retrieve the user's Facebook data.
 * Written by Michael Wheeler, using example code from "Client-Side Data Storage" by Raymond Camden.
 *
 * Note that all timestamps are stored as Date objects and get converted from UNIX timestamps.
 *
 */

function idbOK() {
    /**
     * Checks whether IndexedDB is supported by the browser. Taken from "Client-Side Data Storage".
     */
    return "indexedDB" in window && !/iPad|iPhone|iPod/.test(navigator.platform);
}

function insertIntoIndexedDB(data) {

    console.dir(data);

    // Check browser support for IndexedDB
    if (!idbOK()) {
        throw new Error("IndexedDB is not supported by this browser!");
        return;
    }
    // Delete an existing copy of the database
    deleteDatabaseIfExists("user_facebook_data");
    // Open the database
    let openDBRequest = indexedDB.open("user_facebook_data", 1);

    openDBRequest.onerror = function(e) {
        console.log("Error requesting user_facebook_data database!");
        console.log(e.toString());
    };

    openDBRequest.onupgradeneeded = function(e) {
        /**
         * Check that the tables exist and if not create them along with indexes.
         */
        console.log("Entering onupgradeneeded callback");

        let db = e.target.result;
        if (!db.objectStoreNames.contains("reactions")) {
            let reactionsStore = db.createObjectStore("reactions", {autoIncrement: true});
            reactionsStore.createIndex("timestamp", "timestamp", {"unique": false});
            reactionsStore.createIndex("reaction", "reaction", {"unique": false});
            console.log("Created object store 'reactions'");
        }
    };

    openDBRequest.onsuccess = function(e) {
        /**
         * Load data from our data object into ALL of the IndexedDB object stores.
         */
        console.log("Entering onsuccess callback.");

        let db = e.target.result;

        // Look for the reactions list within the global data object.
        let reactions_list = data["likes_and_reactions"]["posts_and_comments.json"]["reactions"];

        let transaction = db.transaction(["reactions"], "readwrite");
        let store = transaction.objectStore("reactions");

        // Parse all reactions and store them using the transaction
        reactions_list.forEach(function(reaction) {
            // Parse data into a nice format
            let clean_reaction = {
                "timestamp": new Date(reaction["timestamp"] * 1000),
                "reaction": reaction["data"][0]["reaction"]["reaction"]
            };

            // Then store and handle result
            let request = store.add(clean_reaction);

            request.onerror = function(e) {
                console.log("Error on reaction add operation");
                // TODO -- Handle error
            };

            request.onsuccess = function(e) {
                console.log("Reaction add operation succeeded");
            }
        });

        // Now query by type of reaction

        transaction.oncomplete = function(e) {
            let new_transaction = db.transaction(["reactions"], "readonly");
            let store = new_transaction.objectStore("reactions");
            let cursor = store.openCursor();
            let reaction_count = {};

            cursor.onsuccess = function(e) {
                let cursor = e.target.result;
                if (cursor) {
                    console.log(cursor.value.reaction);
                    let reaction = cursor.value.reaction;
                    if (reaction_count[reaction]) {
                        reaction_count[reaction]++;
                    } else {
                        reaction_count[reaction] = 1;
                    }
                    cursor.continue();
                }
            };

            new_transaction.oncomplete = function() {
                console.dir(reaction_count);
            }
        }


    }

}

function deleteDatabaseIfExists(dbName) {
    /**
     * Copied from MDN: https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/deleteDatabase
     */
    let DBDeleteRequest = window.indexedDB.deleteDatabase(dbName);

    DBDeleteRequest.onerror = function(event) {
        console.log(`Error deleting database ${dbName}.`);
    };

    DBDeleteRequest.onsuccess = function(event) {
        console.log(`Database ${dbName} deleted successfully.`);
        console.log(event.result); // should be undefined
    };
}