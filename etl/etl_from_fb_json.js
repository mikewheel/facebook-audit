// converts data from facebook's data export format
// to something we can actually use.

/**
 * Converts the given files into usable json. The output format is a mapping from visualization names
 * to the rawData that the visualization needs, in the format that the visualization needs.
 * @param e the CustomEvent that is emitted by the unzip function.
 */
function etl(e) {
    try {
        let rawData = e.detail;
        console.log(e);
        console.log(rawData);
        var detail = {
            "ads": parse_ads(rawData["ads"]),
            "apps": parse_apps(rawData["apps_and_websites"]),
            "comments": parse_comments(rawData["comments"]),
            "events": parse_events(rawData["events"]),
            "friends": parse_friends(rawData["friends"]),
            "groups": parse_groups(rawData["groups"]),
            "reactions": parse_reactions(rawData["likes_and_reactions"]),
            "messages": parse_messages(rawData["messages"]),
            "posts": parse_posts(rawData["posts"]),
            "profile_information": parse_profile_info(rawData["profile_information"]),
            "search_history": parse_search_history(rawData["search_history"])
        };
        let event = new CustomEvent("etl-complete", { detail: detail });
        document.dispatchEvent(event);
    } catch (error) {
        throw error;
        let errorEvent = new CustomEvent("error-triggered", { detail: "Error parsing data!" });
        document.dispatchEvent(errorEvent);
        console.log(JSON.stringify(error));
    }
}

function get(data, args) {
    var intermed = data;
    args.forEach(function (arg) {
        if (intermed.hasOwnProperty(arg)) {
            intermed = intermed[arg];
        } else {
            return {}
        }
    });
    console.log(intermed)
    return intermed;
}

function parse_ads(data) {
    return {
        "ad_interests": get(data, ["ads_interests.json", "topics"]),
        "targeting_advertisers": get(data, ["advertisers_who_uploaded_a_contact_list_with_your_information.json",
            "custom_audiences"])
    }
}

function parse_apps(data) {
    let installedAppsList = [];
    get(data, ["apps_and_websites.json", "installed_apps"]).forEach(function (app) {
        installedAppsList.push(app["name"])
    });
    return installedAppsList;
}

function parse_comments(data) {
    let commentsList = [];
    get(data, ["comments.json", "comments"]).forEach(function (comment) {
        commentsList.push({
            "timestamp": get(comment, ["timestamp"]),
            "comment": get(comment, ["data", 0, "comment", "comment"])
        })
    });
    return commentsList;
}

function parse_events(data) {
    return {
        "hosted": get(data, ["your_events.json", "your_events"]),
        "invited": get(data, ["event_invitations.json", "events_invited"]),
        "accepted": get(data, ["your_event_responses.json", "event_responses", "events_joined"]),
        "interested": get(data, ["your_event_responses.json", "event_responses", "events_interested"]),
        "declined": get(data, ["your_event_responses.json", "event_responses", "events_declined"]),
    };
}

function parse_friends(data) {
    return {
        "friends": get(data, ["friends.json", "friends"]),
        "former_friends": get(data, ["removed_friends.json", "deleted_friends"]),
        "requests_you_rejected": get(data, ["rejected_friend_requests.json", "rejected_requests"]),
    };
}

function parse_groups(data) {
    return {
        "group_memberships": get(data, ["your_group_membership_activity.json", "groups_joined"])
    }
}

function parse_reactions(data) {
    // Look for the reactions list within the global data object.
    let reactionsList = get(data, ["posts_and_comments.json", "reactions"]);
    let cleanedReactionsList = [];

    // Parse all reactions and store them using the transaction
    reactionsList.forEach(function (reaction) {
        // Parse data into a nice format
        let cleaned_reaction = {
            "timestamp": new Date(reaction["timestamp"] * 1000),
            "reaction": get(reaction, ["data", 0, "reaction", "reaction"])
        };
        cleanedReactionsList.push(cleaned_reaction)
    });

    return {
        "posts_and_comments": cleanedReactionsList,
        "pages": get(data, ["pages.json", "page_likes"])
    }
}

function parse_messages(data) {
    let messages = [];

    for (let dir in data) {
        if (data.hasOwnProperty(dir)) {
            for (let convoName in data[dir]) {
                if (data[dir].hasOwnProperty(convoName)) {
                    let personalMessages = get(data, [dir, convoName, "message.json", "messages"]);
                    personalMessages.forEach(function (messageObject) {
                        messages.push(messageObject);
                    });
                }
            }
        }
    }
    return messages;
}

function parse_posts(data) {
    return get(data, ["your_posts.json", "status_updates"]);
}

function parse_profile_info(data) {
    return get(data, ["profile_information.json"]);
}

function parse_search_history(data) {
    return get(data, ["your_search_history.json", "searches"]);
}
