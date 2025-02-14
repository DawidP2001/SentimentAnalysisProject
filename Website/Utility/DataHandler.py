"""
This file will deal with changing the data into a pandaFrame and storing it 
"""

import praw
import datetime
import pandas as pd
from Utility import SenitmentAnalyser as s

def converDataToJSON(data):
    return data.to_json(orient='records')

def extractData(rawData):
    list = createDictList(rawData)
    data = pd.DataFrame(list)
    data = addExtraFields(data)
    return data

def addExtraFields(data):
    data = addSentimentField(data)
    return data

def addSentimentField(data):
    textList = data['title'].tolist()
    results = s.getSentimentScores(textList)
    labels = [entry["label"] for entry in results]
    positiveScores = [entry["positiveScore"] for entry in results]
    neutralScores = [entry["neutralScore"] for entry in results]
    negativeScores = [entry["negativeScore"] for entry in results]
    compoundScores = [entry["negativeScore"] for entry in results]
    data['label'] = labels
    data['positiveScore'] = positiveScores
    data['neutralScore'] = neutralScores
    data['negativeScore'] = negativeScores
    data['compoundScore'] = compoundScores
    return data

def dataToDictionary(submission):
    if type(submission) is praw.models.reddit.submission.Submission:
        return {
            "title": submission.title,
            "subreddit": submission.subreddit.display_name,
            "author": submission.author.name,
            "created_utc": datetime.datetime.fromtimestamp(submission.created_utc),
            "num_comments": submission.num_comments,
            "over_18": submission.over_18,
            "permalink": submission.permalink,
            "upvotes": submission.score,
            "upvote_ratio": submission.upvote_ratio,
            "selftext": submission.selftext,
            "Type": "Post"
        }
    if type(submission) is praw.models.reddit.comment.Comment:
        author = "N/A"
        try:
            author = submission.author.name
        except AttributeError:
            pass
        return {
            "title": "N/A",
            "subreddit": submission.subreddit.display_name,
            "author": author,
            "created_utc": datetime.datetime.fromtimestamp(submission.created_utc),
            "num_comments": "N/A",
            "over_18": "N/A",
            "permalink": submission.permalink,
            "upvotes": submission.score,
            "upvote_ratio": "N/A",
            "selftext": "N/A",
            "Type" : "Comment"
        }
# This function converts the submissions into a list of dictionaries
def createDictList(submissions):
    list = []
    for submission in submissions:
        list.append(dataToDictionary(submission))
    return list
