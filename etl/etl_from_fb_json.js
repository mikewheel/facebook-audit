// converts data from facebook's data export format
// to something we can actually use.

/**
 * Converts the given files into usable json. The output format is a mapping from visualization names
 * to the rawData that the visualization needs, in the format that the visualization needs.
 * @param e the CustomEvent that is emitted by the unzip function.
 * @return a mapping from rawData viz name to rawData, or false if an error occurred
 */
function etl(e) {
    try {
        let rawData = e.detail;
        console.log(e);
        //console.log(rawData);
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
        console.log(error);
        return false; // TODO: EMIT FAILURE EVENT
    }
}

function parse_ads(data) {
    return {
        "ad_interests": data["ads_interests.json"]["topics"],
        "targeting_advertisers": data["advertisers_who_uploaded_a_contact_list_with_your_information.json"]
            ["custom_audiences"]
    }
}

function parse_apps(data) {
    let installedAppsList = [];
    data["apps_and_websites.json"]["installed_apps"].forEach(function (app) {
        installedAppsList.push(app["name"])
    });
    return installedAppsList;
}

function parse_comments(data) {
    let commentsList = [];
    data["comments.json"]["comments"].forEach(function (comment) {
        commentsList.push({
            "timestamp": comment["timestamp"],
            "comment": comment["data"][0]["comment"]["comment"]
        })
    });
    return commentsList;
}

function parse_events(data) {
    return {
        "hosted": data["your_events.json"]["your_events"],
        "invited": data["event_invitations.json"]["events_invited"],
        "accepted": data["your_event_responses.json"]["event_responses"]["events_joined"],
        "interested": data["your_event_responses.json"]["event_responses"]["events_interested"],
        "declined": data["your_event_responses.json"]["event_responses"]["events_declined"],
    };
}

function parse_friends(data) {
    return {
        "friends": data["friends.json"]["friends"],
        "former_friends": data["removed_friends.json"]["deleted_friends"],
        "requests_you_rejected": data["rejected_friend_requests.json"]["rejected_requests"],
    };
}

function parse_groups(data) {
    return {
        "group_memberships": data["your_group_membership_activity.json"]["groups_joined"]
    }
}

function parse_reactions(data) {
    // Look for the reactions list within the global data object.
    let reactionsList = data["posts_and_comments.json"]["reactions"];
    let cleanedReactionsList = [];

    // Parse all reactions and store them using the transaction
    reactionsList.forEach(function (reaction) {
        // Parse data into a nice format
        let cleaned_reaction = {
            "timestamp": new Date(reaction["timestamp"] * 1000),
            "reaction": reaction["data"][0]["reaction"]["reaction"]
        };
        cleanedReactionsList.push(cleaned_reaction)
    });

    return {
        "posts_and_comments": cleanedReactionsList,
        "pages": data["pages.json"]["page_likes"]
    }
}

function parse_messages(data) {
    let messages = [];

    for (let dir in data) {
        if (data.hasOwnProperty(dir)) {
            for (let convoName in data[dir]) {
                if (data[dir].hasOwnProperty(convoName)) {
                    let personalMessages = data[dir][convoName]["message.json"]["messages"];
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
    return data["your_posts.json"]["status_updates"];
}

function parse_profile_info(data) {
    return data["profile_information.json"];
}

function parse_search_history(data) {
    return data["your_search_history.json"]["searches"];
}
