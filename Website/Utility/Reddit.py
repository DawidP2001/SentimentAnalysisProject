"""
Author: Dawid Pionk
Date: 25/01/2025
Description: This file contains functions which are used to query the Reddit API using praw
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
# This function queries the Reddit API for a specific subreddit
def queryAPI(query: str, subreddit: str, querySize: str):
    qeuerySizeInt = int(querySize)
    results = reddit.subreddit(subreddit).search(query, limit=qeuerySizeInt)
    return results

def getRedditor(userString: str):
    return reddit.redditor(userString)

# This function extracts data from a user search
def queryUser(redditor: str, typeOfPost: str, typeOfSearch: str, searchTimeFrame: str, querySize: str):
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
    
# This function extracts specific data from a subreddit
def querySubreddit(subreddit: str, type: str, querySize: str, timeFrame: str):
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

# This function queries the Reddit API for comments from a post
def queryComment(searchType, contents, sortBy, querySize):
    if searchType == "link":
        submission = reddit.submission(url=contents)    
    elif searchType == "id":
        submission = reddit.submission(id=contents)

    submission.comments.replace_more(limit=0) #This is set to 0 to remove all MoreComments objects
    # This is done so it wouldnt dig to deep into the comments hierarchy
    submission.comment_sort = sortBy
    # Below returns a certain amount of comments as a flat list
    querySizeInt = int(querySize)
    commentsList = submission.comments.list()[:querySizeInt] 
    return commentsList

# This function queries the Reddit API for a specific domains
def queryDomain(searchContents, typeOfSearch, searchTimeFrame, querySize):
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

# This function extracts the titles of the posts from query
def extractPostTitles(query):
    resultList = []
    for post in query:
        resultList.append(post.title)
    return resultList

# This function extracts the subreddits from the results of the query
def extractPostSubreddits(results):
    resultList = []
    for post in results:
        resultList.append(post.subreddit)
    return resultList

# This function extracts specific information from the results of a query
def extractData(results):
    titleList = []
    subbredditList = []
    authorList = []
    for post in results:
        subbredditList.append(post['subreddit'])
        titleList.append(post['title'])
        authorList.append(post['author'])
    return titleList, subbredditList, authorList

