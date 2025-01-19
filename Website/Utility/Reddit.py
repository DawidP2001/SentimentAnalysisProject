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

