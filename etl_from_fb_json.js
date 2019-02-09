// converts data from facebook's data export format
// to something we can actually use.


const example = {
  "profile_information": {
    "profile_information.json": {
      "profile": {
        "name": {
          "full name": "Julian Zucker"
        }
      }
    }
  },
  "messages": {
    "inbox": {
      "clairegraves_muxfzb9hsa": {
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
              "timestamp_ms": 1533389390317,
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
  }
};

/**
 * Converts the given files into usable json. The output format is a mapping from visualization names
 * to the data that the visualization needs, in the format that the visualization needs.
 * @param fileList a dictionary, mapping filenames to file contents (the files from the JSON dump)
 */
function etl(fileList) {
  // get your name
  const name = fileList["profile_information"]["profile_information.json"]["profile"]["name"]["full name"];

  /*
   * The messages data visualization requires a sorted list, with each element in the list being
   * an array with two elements, a timestamp and a number of messages happening after that timestamp
   * but before the next timestamp in the list. Timestamps are spaced by one day.
   */
  const messageFiles = fileList["messages"];
  return {"messages_viz": etlMessages(name, messageFiles)}
}

function etlMessages(name, messageFiles) {
  // a mapping from each recipient to the timestamps of each messages you've sent them (unsorted)
  var messagesSent = {};

  const inbox = messageFiles["inbox"];

  Object.keys(inbox).forEach(file => {
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
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    })
  });

  // at this point, messagesSent is a mapping from each recipient to the timestamp of each message they
  // have received, as a full timestamp

  var messageCounts = {};
  Object.keys(messagesSent).forEach(recipient => {
    messageCounts[recipient] = {};
    const timestamps = messagesSent[recipient];
    timestamps.forEach(t => {
      messageCounts[recipient][t] = (messageCounts[recipient][t] || 0) + 1
    })
  });


  // convert to array
  var messageCountsArr = {};
  Object.keys(messageCounts).forEach(user => {
    messageCountsArr[user] = [];
    Object.keys(messageCounts[user]).forEach(x => {
      messageCountsArr[user].push([x, messageCounts[user][x]])
    })
  });

  return messageCountsArr
}


const out = etl(example);
console.log(JSON.stringify(out, null, 2));