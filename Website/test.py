import datetime
from Utility import Reddit as r
from Utility import Utils
#from Utility import DataHandler as d
import os
from collections import Counter
from pytrends.request import TrendReq
from Utility import SenitmentAnalyser as s

rawData = r.queryAPI("Poland", "all", 50)
print(s.getSentimentScores(rawData))