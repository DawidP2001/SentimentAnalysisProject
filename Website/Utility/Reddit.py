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

def extractData(query: str):
    results = reddit.subreddit("all").search(query, limit=10)
    resultList = []
    for post in results:
        resultList.append(post.title)
    return resultList