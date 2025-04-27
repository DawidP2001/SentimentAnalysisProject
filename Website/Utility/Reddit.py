"""
@file Reddit.py
@brief This file contains functions used to query the Reddit API using PRAW.
@date 27/04/2025
@author Dawid Pionk
"""

import praw
import os
from dotenv import load_dotenv

load_dotenv()
APP_ID = os.getenv("APP_ID")
APP_SECRET = os.getenv("APP_SECRET")

reddit = praw.Reddit(
    client_id= APP_ID,
    client_secret=APP_SECRET,
    user_agent="SentimentAnalysisTool/v1.0 by xxx_madlad_xxx"
)
def queryAPI(query: str, subreddit: str, querySize: str):
    """
    @brief This function queries the Reddit API for a specific subreddit

    @param query - The topic to search for
    @param subreddit - The name of the subreddit to search within.
    @param querySize - The number of results to retrieve, specified as a string.

    @return A list of search results (Reddit submission objects) matching the query.
    """
    qeuerySizeInt = int(querySize)
    results = reddit.subreddit(subreddit).search(query, limit=qeuerySizeInt)
    return results

def getRedditor(userString: str):
    """
    @brief Retrieves a Redditor object

    @param userString - The username of the Redditor to be fetched.

    @return A Redditor object
    """
    return reddit.redditor(userString)
 
def queryUser(redditor: str, typeOfPost: str, typeOfSearch: str, searchTimeFrame: str, querySize: str):
    """
    @brief This function extracts data from a user search

    @param redditor - The Redditor whose posts or comments are to be queried.
    @param typeOfPost - Specifies whether to search for 'submissions' or 'comments'.
    @param typeOfSearch - Defines the type of search (e.g., 'hot', 'new', 'top', 'controversial' for submissions).
    @param searchTimeFrame - Specifies the time frame for searching 'top' or 'controversial' posts (e.g., 'week', 'month').
    @param querySize - The number of results to retrieve (specified as a string, will be converted to integer).

    @return A list of submission or comment objects based on the specified query parameters.
    """
    querySizeInt = int(querySize)
    # This is for searching for redditors submissions
    if typeOfPost == "submissions":
        if typeOfSearch == "hot":
            return redditor.submissions.hot(limit=querySizeInt)
        elif typeOfSearch == "new":
            return redditor.submissions.new(limit=querySizeInt)
        elif typeOfSearch == "top":
            return redditor.submissions.top(limit=querySizeInt, time_filter=searchTimeFrame)
        elif typeOfSearch == "controversial":
            return redditor.submissions.controversial(limit=querySizeInt, time_filter=searchTimeFrame)
        else:
            return redditor.submissions.hot(limit=querySizeInt)
    # This is for searching for redditors comments
    elif typeOfPost == "comments":
        return redditor.comments.new(limit=querySizeInt)
    elif typeOfPost == "upvoted":
        return redditor.upvoted(limit=querySizeInt)
    elif typeOfPost == "downvoted":
        return redditor.downvoted(limit=querySizeInt)
    
def querySubreddit(subreddit: str, type: str, querySize: str, timeFrame: str):
    """
    @brief This function extracts specific data from a subreddit

    @param subreddit - The name of the subreddit to query.
    @param type - Specifies the type of posts to retrieve (e.g., 'hot', 'new', 'top', 'controversial').
    @param querySize - The number of posts to retrieve (specified as a string, will be converted to integer).
    @param timeFrame - A time filter for 'top' or 'controversial' posts (e.g., 'week', 'month').

    @return A list of submission objects from the specified subreddit based on the search criteria.
    """
    querySizeInt = int(querySize)
    if type == "hot":
        return reddit.subreddit(subreddit).hot(limit=querySizeInt)
    elif type == "new":
        return reddit.subreddit(subreddit).new(limit=querySizeInt)
    elif type == "top":
        return reddit.subreddit(subreddit).top(limit=querySizeInt)
    elif type == "controversial":
        return reddit.subreddit(subreddit).controversial(limit=querySizeInt)
    else:
        return reddit.subreddit(subreddit).hot(limit=querySizeInt)

def queryComment(searchType, contents, sortBy, querySize):
    """
    @brief This function queries the Reddit API for comments from a post

    @param searchType - Type of search, can be either "link" (URL) or "id" (Post ID).
    @param contents - The URL or post ID to fetch comments for.
    @param sortBy - The sorting criteria for comments
    @param querySize - The maximum number of comments to return

    @return A list of comment objects, limited to the specified query size.
    """
    if searchType == "link":
        submission = reddit.submission(url=contents)    
    elif searchType == "id":
        submission = reddit.submission(id=contents)
        
    submission.comment_sort = sortBy
    submission.comments.replace_more(limit=0) #This is set to 0 to remove all MoreComments objects
    # This is done so it wouldnt dig to deep into the comments hierarchy
    
    # Below returns a certain amount of comments as a flat list
    querySizeInt = int(querySize)
    commentsList = submission.comments.list()[:querySizeInt] 
    return commentsList

def queryDomain(searchContents, typeOfSearch, searchTimeFrame, querySize):
    """
    @brief This function queries the Reddit API for a specific domains

    @param searchContents - The domain or URL to search for posts related to (e.g., 'example.com').
    @param typeOfSearch - Specifies the type of posts to retrieve
    @param searchTimeFrame - A time filter for "top" or "controversial" posts. Options include 'hour', 'day', 'week', 'month', 'year', 'all'.
    @param querySize - The number of posts to retrieve

    @return A list of posts related to the specified domain, filtered by the specified search criteria.
    """
    querySizeInt = int(querySize)
    match typeOfSearch:
        case "hot":
            return reddit.domain(searchContents).hot(limit=querySizeInt)
        case "new":
            return reddit.domain(searchContents).new(limit=querySizeInt)
        case "rising":
            return reddit.domain(searchContents).rising(limit=querySizeInt)
        case "randomRising":
            return reddit.domain(searchContents).random_rising(limit=querySizeInt)
        case "top":
            return reddit.domain(searchContents).top(time_filter=searchTimeFrame, limit=querySizeInt)
        case "controversial":
            return reddit.domain(searchContents).controversial(time_filter=searchTimeFrame, limit=querySizeInt)