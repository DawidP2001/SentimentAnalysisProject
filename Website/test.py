import datetime
from Utility import Reddit as r
from Utility import Utils
#from Utility import DataHandler as d
import os
from collections import Counter
from pytrends.request import TrendReq
#from Utility import SenitmentAnalyser as s
from textblob import TextBlob


"""
rawData = r.queryAPI("Poland", "all", 100)
text = []
for entry in rawData:
    text.append(entry.title + " " + entry.selftext)
polarity = []
for t in text:
    polarity.append(t + " - " + str(TextBlob(t).sentiment.polarity))
print(text)
"""
"""
rawData = r.queryAPI("Poland", "all", 100)
for entry in rawData:
    print(entry.url)
"""

import feedparser

# Google Trends RSS feed for the U.S.
rss_url = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US"

feed = feedparser.parse(rss_url)
print(feed)
for entry in feed.entries:
    print(entry.title)  # Trending search term