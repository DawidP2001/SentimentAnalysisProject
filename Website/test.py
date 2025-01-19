from collections import Counter
import time
import praw


reddit = praw.Reddit(
    client_id= APP_ID,
    client_secret=APP_SECRET,
    user_agent="SentimentAnalysisTool/v1.0 by xxx_madlad_xxx"
)
response = reddit.subreddit('learnpython').hot(limit=1)

# Print the rate limit information
print(f"Remaining requests: {reddit.user.me().rate_limit_status()['remaining']}")
print(f"Rate limit reset time: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(reddit.user.me().rate_limit_status()['reset']))}")