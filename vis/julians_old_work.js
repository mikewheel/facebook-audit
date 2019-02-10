/**
 * A file that contains some of Julian's work from earlier, just so we don't lose it.
 */

// return {
//     /*
//    * The messages data visualization requires a sorted list, with each element in the list being
//    * an array with two elements, a timestamp and a number of messages happening after that timestamp
//    * but before the next timestamp in the list. Timestamps are spaced by one day.
//    * [it is actually a mapping for each user you have messaged to this array format]
//    *
//    */
//     "messages_viz": etlMessageFrequency(name, messageFiles),
//     /*
//      * This is just a simple number: how many advertisers uploaded your email.
//      */
//     "num_advertisers_with_email": etlNumAdvertisersWithEmail(adFiles),
//     /*
//      * This is a mapping from names of people to an array, for each birthday you've
//      * had since you created facebook, of a boolean saying whether they wished
//      * you a birthday in that year.
//      */
//     "birthdays_viz": etlBirthdays(timeCreated, birthday, postsOnYourTL),
//     /*
//      * This is the same format as messages, but with search frequency instead of
//      * message freq.
//      */
//     "searches_viz": etlSearchFrequency(searchFiles)
// }

function etlMessageFrequency(name, messageFiles) {
    // a mapping from each recipient to the timestamps of each messages you've sent them (unsorted)
    var messagesSent = {};
    const inbox = messageFiles["inbox"];

    Object.keys(inbox).forEach(file => {
        // Note: this line is here to account for a weird capitalization issue with the filenames.
        file = file.toLowerCase();

        // for each file with messages (corresponds to one group chat/DM)
        const fileContent = inbox[file]["message.json"];

        const participants = fileContent["participants"];
        const messages = fileContent["messages"];
        // people other than you
        const recipients = participants.map(p => p.name).filter(p => p !== name);

        // for each message, add a timestamp to each person who received the message
        messages.forEach(message => {
            const time = new Date(message["timestamp_ms"]);
            recipients.forEach(recipient => {
                if (messagesSent[recipient] === undefined) {
                    messagesSent[recipient] = []
                }
                messagesSent[recipient].push(time);
            })
        })
    });

    Object.keys(messagesSent).forEach(recipient => {
        messagesSent[recipient].sort();
        messagesSent[recipient] = messagesSent[recipient].map(date => {
            return new Date(date.getFullYear(), date.getMonth(), 1)
        })
    });

    return timestampsToCounts(messagesSent)
}

/**
 *
 * @param mappingTimestamps a mapping of some string to timestamps
 */
function timestampsToCounts(mappingTimestamps) {
    // at this point, messagesSent is a mapping from each recipient to the timestamp of each message they
    // have received, as a full timestamp
    var countsByDay = {};
    Object.keys(mappingTimestamps).forEach(key => {
        countsByDay[key] = {};
        const timestamps = mappingTimestamps[key];
        timestamps.forEach(date => {
            countsByDay[key][date] = (countsByDay[key][date] || 0) + 1
        })
    });

    // convert to array
    var countsArr = {};
    Object.keys(countsByDay).forEach(user => {
        countsArr[user] = [];
        Object.keys(countsByDay[user]).forEach(x => {
            countsArr[user].push([new Date(Date.parse(x)), countsByDay[user][x]])
        })
        countsArr[user].sort((e1, e2) => e2[0] - e1[0]);

        // fill in the array with zeroes for every missing day
        const timestamps = countsArr[user].map(e => e[0]);
        const day = new Date(timestamps[timestamps.length - 1]);
        day.setMonth(day.getMonth() + 1);

        console.log(timestamps)
        while (day < timestamps[0]) {
            if (!timestamps.some(date => {
                return date.getFullYear() == day.getFullYear() && date.getMonth() == day.getMonth()
            })) {
                countsArr[user].push([new Date(day), 0]);
            }
            day.setMonth(day.getMonth() + 1);
        }

        countsArr[user].sort((e1, e2) => e2[0] - e1[0]);
    });

    return countsArr
}


function etlNumAdvertisersWithEmail(adsFileList) {
    return adsFileList["advertisers_who_uploaded_a_contact_list_with_your_information.json"]["custom_audiences"].length
}

/**
 * For each person who has posted on your timeline for your birthday at least once,
 * in what years did they post?
 * @param timeCreated the timestamp when you created facebook
 * @param birthdate your birthday, a Date object. Only year, month, and day are used.
 * @param postsOnTL the posts on your timeline
 */
function etlBirthdays(timeCreated, birthdate, postsOnTL) {
    const birthdayOnYearAccountCreated = new Date(
        timeCreated.getFullYear(),
        birthdate.getMonth(),
        birthdate.getDate());

    // your first birthday after making facebook
    const firstBirthday = birthdayOnYearAccountCreated;
    if (birthdayOnYearAccountCreated < timeCreated) {
        // in other words, if your birthday in the year your account was created
        // happened before your account (and so no one could wish you happy birthday
        // the year you created your account), add one year
        firstBirthday.setFullYear(firstBirthday.getFullYear() + 1);
    }

    var birthdayToCheck = firstBirthday;
    const today = new Date();

    // a mapping from people's names to the years they did and did not wish you
    // a happy birthday (or, to simplify, just posted on your wall on your birthday)
    var birthdayWishes = {};
    const posts = postsOnTL["wall_posts_sent_to_you"];

    posts.forEach(post => {
        const poster = post["title"].split(" wrote on your timeline.")[0];
        birthdayWishes[poster] = birthdayWishes[poster] || []
    });


    while (birthdayToCheck < today) {
        const year = birthdayToCheck.getFullYear();

        Object.keys(birthdayWishes).forEach(poster => {
            const postsByPoster = posts.filter(post => {
                return post.title.includes(poster)
            });

            const postedOnBirthday = postsByPoster.some(post => {
                const postDate = new Date(post["timestamp"] * 1000);
                return (birthdayToCheck.getFullYear() === postDate.getFullYear()
                    && birthdayToCheck.getMonth() === postDate.getMonth()
                    && birthdayToCheck.getDate() === postDate.getDate())
            });
            birthdayWishes[poster].push([year, postedOnBirthday])
        });
        birthdayToCheck.setFullYear(year + 1)
    }

    return birthdayWishes
}


function etlSearchFrequency(searchFiles) {
    const searchHistory = searchFiles["your_search_history.json"]["searches"];
    const searchesAndTimes = searchHistory.map(search => {
        if (!search.data) {
            return false
        }
        const searchText = search.data[0].text;
        const searchTime = new Date(search.timestamp * 1000);
        const searchDate = new Date(
            searchTime.getFullYear(),
            searchTime.getMonth(),
            1);

        return [searchText, searchDate]
    }).filter(search => search !== false);


    const searchTimestamps = {};
    searchesAndTimes.forEach(searchAndTimestamp => {
        const search = searchAndTimestamp[0];
        const timestamp = searchAndTimestamp[1];
        searchTimestamps[search] = searchTimestamps[search] || [];
        searchTimestamps[search].push(timestamp)
    });

    Object.keys(searchTimestamps).forEach(key => {
        searchTimestamps[key].sort();
    });

    return timestampsToCounts(searchTimestamps);
}


const example = {
    "profile_information": {
        "profile_information.json": {
            "profile": {
                "name": {
                    "full name": "Julian Zucker"
                },
                "birthday": {
                    "year": 1998,
                    "month": 9,
                    "day": 28
                },
                "registration_timestamp": 1277515162,
            }
        }
    },
    "messages": {
        "inbox": {
            "person1_muxfzb9hsa": {
                "message.json": {
                    "participants": [
                        {
                            "name": "Person 1"
                        },
                        {
                            "name": "Julian Zucker"
                        }
                    ],
                    "messages": [
                        {
                            "sender_name": "Julian Zucker",
                            "timestamp_ms": 1533389504039,
                            "content": "message1",
                            "type": "Generic"
                        },
                        {
                            "sender_name": "Person 1",
                            "timestamp_ms": 1513159390317,
                            "content": "message 1",
                            "type": "Generic"
                        }
                    ]
                }
            }, "arr2_asdfas": {
                "message.json": {
                    "participants": [
                        {
                            "name": "Person 1"
                        },
                        {
                            "name": "Julian Zucker"
                        },
                        {
                            "name": "Person 2"
                        }
                    ],
                    "messages": [
                        {
                            "sender_name": "Julian Zucker",
                            "timestamp_ms": 1533389504039,
                            "content": "message1",
                            "type": "Generic"
                        },
                        {
                            "sender_name": "Person 1",
                            "timestamp_ms": 1533085150317,
                            "content": "message 1",
                            "type": "Generic"
                        }
                    ]
                }
            }
        }
    },
    "ads": {
        "advertisers_who_uploaded_a_contact_list_with_your_information.json": {
            "custom_audiences": [
                "#1 Cochran",
                "20th Century Fox Home Entertainment",
                "8x8",
                "A and J Motors",
                "A Star is Born"
            ]
        }
    },
    "posts": {
        "other_people's_posts_to_your_timeline.json": {
            "wall_posts_sent_to_you": [
                {
                    "timestamp": 1538231759,
                    "data": [
                        {
                            "post": "Happy Birthday!!!"
                        }
                    ],
                    "title": "Person 1 wrote on your timeline."
                },
                {
                    "timestamp": 1538181959,
                    "data": [
                        {
                            "post": "Happy Birthday Julian!"
                        }
                    ],
                    "title": "Person 2 wrote on your timeline."
                }
            ]
        }
    },
    "search_history": {
        "your_search_history.json": {
            "searches": [
                {
                    "timestamp": 1549119643,
                    "data": [
                        {
                            "text": "events"
                        }
                    ],
                    "title": "You searched for events"
                },
                {
                    "timestamp": 1549119643,
                    "data": [
                        {
                            "text": "events"
                        }
                    ],
                    "title": "You searched for events"
                },
                {
                    "timestamp": 1549119625,
                    "data": [
                        {
                            "text": "thing2"
                        }
                    ],
                    "title": "You searched for thing2"
                }]
        }
    }
};
