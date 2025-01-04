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
# This function queries the Reddit API
def queryAPI(query: str):
    results = reddit.subreddit("all").search(query, limit=10)
    return results

def queryAPI(query: str, querySize: str):
    qeuerySize = int(querySize)
    results = reddit.subreddit("all").search(query, limit=querySize)
    return results

# This function queries the Reddit API for a specific subreddit
def queryAPI(query: str, subreddit: str, querySize: str):
    qeuerySize = int(querySize)
    results = reddit.subreddit(subreddit).search(query, limit=querySize)
    return results

# This function extracts data from a user search
def queryUser(user):
    user = reddit.redditor(user)
    return user.submissions.new(limit=10)

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

def extractData(results):
    titleList = []
    subbredditList = []
    authorList = []
    for post in results:
        titleList.append(post['title'])
        subbredditList.append(post['subreddit'])
        authorList.append(post['author'])
    return titleList, subbredditList, authorList

