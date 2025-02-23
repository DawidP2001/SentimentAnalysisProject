"""
This file will deal with changing the data into a pandaFrame and storing it 
"""

import praw
import datetime
import pandas as pd
import requests
import numpy as np
from io import BytesIO
from PIL import Image
from Utility import SenitmentAnalyser as s
import logging

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
    results = s.getSentimentScores(data)
    labels = [entry["label"] for entry in results]
    positiveScores = [entry["positiveScore"] for entry in results]
    neutralScores = [entry["neutralScore"] for entry in results]
    negativeScores = [entry["negativeScore"] for entry in results]
    compoundScores = [entry["compoundScore"] for entry in results]
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
            "Type": "Post",
            "url": submission.url,
            "content": "N/A",
            "contentType": "N/A"
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
            "selftext": submission.body,
            "Type" : "Comment",
            "url": "N/A",
            "content": "N/A",
            "contentType": "N/A"
        }
def redditorToDictionary(redditor):
    try:
        redditorIsSuspended = redditor.is_suspended
    except Exception as e:
        logging.error(f"redditortoDictionary() Failed: {e}")
        redditorIsSuspended = "False"
    finally:
        redditorIsSuspended = "False"
    return {
        "comment_karma": redditor.comment_karma,
        "created_utc": datetime.datetime.fromtimestamp(redditor.created_utc),
        "id": redditor.id,
        "is_employee": redditor.is_employee,
        "is_mod": redditor.is_mod,
        "is_gold": redditor.is_gold,
        "is_suspended": redditorIsSuspended,
        "link_karma": redditor.link_karma,
        "name": redditor.name
    }
# This function converts the submissions into a list of dictionaries
def createDictList(submissions):
    list = []
    for submission in submissions:
        list.append(dataToDictionary(submission))
    return list
########################################################################
###### ##CURRENTLY NOT IMPLEMENTED
def extractContent(data):
    url = data['url']
    if "i.redd.it" in url:
        image_array = extractImages(data['url'])
        data['content'] = image_array
        data['contentType'] = "Single Image"
    elif "v.redd.it" in url:
        extractVideos()
    elif "www.reddit.com/gallery/" in url:
        extractGallery()
    else:
        extractArticles()

# Most likely gonna use AI to implement this section
def extractArticles():
    pass

def extractImages(url):
    response = requests.get(url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content))  # Load into PIL Image
        image_array = np.array(image)  # Convert to NumPy array
    return image_array

def extractVideos():
    pass

def extractGallery():
    pass