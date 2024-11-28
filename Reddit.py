import requests
import praw

REDDIT_USERNAME = "xxx_madlad_xxx"
REDDIT_PASSWORD = "Grazynakaszuny11"
APP_ID = "0ebfteSmNsBkV52MSDf7LA"
APP_SECRET = "I3Rret4vTQg4iBsHzNshzm4oCdGaYw"

reddit = praw.Reddit(
    client_id= APP_ID,
    client_secret=APP_SECRET,
    user_agent="SentimentAnalysisTool/v1.0 by xxx_madlad_xxx"
)

query = "sentiment analysis"
results = reddit.subreddit("all").search(query, limit=10)
for post in results:
    print(f"Title: {post.title}")
    print(f"Subreddit: {post.subreddit}")
    print(f"Score: {post.score}")
    print(f"URL: {post.url}")
    print("-" * 20)