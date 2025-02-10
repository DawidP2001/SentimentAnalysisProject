import datetime
from Utility import Reddit as r
from Utility import Utils
from Utility import DataHandler as d
import os
from collections import Counter

rawData = r.queryAPI("Poland", "all", 50)
data = d.extractData(rawData)
print(data.head())
data.to_excel("C:\\Users\\dawid\\Desktop\\reddit_sentiment.xlsx", index=False)
