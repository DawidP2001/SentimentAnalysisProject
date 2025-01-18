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

# This function extracts data from a user search
def queryUser(user, type: str, querySize: str):
    user = reddit.redditor(user)
    if type == "hot":
        return user.submissions.hot(limit=10)
    elif type == "new":
        return user.submissions.new(limit=10)
    elif type == "top":
        return user.submissions.top(limit=10)
    elif type == "controversial":
        return user.submissions.controversial(limit=10)
    else:
        return user.submissions.hot(limit=10)

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
        titleList.append(post['title'])
        subbredditList.append(post['subreddit'])
        authorList.append(post['author'])
    return titleList, subbredditList, authorList

