"""
Author: Dawid Pionk
Date: 25/01/2025
Description: This file contains utility functions that are used in the main.py file
"""


from collections import Counter

import praw
#from Utility import SenitmentAnalyser as s
from Utility import testSenitmentAnalyser as s
import datetime

def countLables(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    resultArray = [len(positiveSentimentList) , len(neutralSentimentList), len(negativeSentimentList)]
    return resultArray

# Converts the return of the counter method into 2
# lists that can be then passed into the javascript function
# used to display the bar chart for unique subreddits
def convertSubOccurencesForJs(subredditCounter):
    keys = subredditCounter.keys()
    keyList = []
    itemList = []
    for key in keys:
        keyList.append(key)
        itemList.append(subredditCounter[key])
    keyList, itemList = sortSubredditOccurences(keyList, itemList)
    return keyList, itemList
# Sorts the items in the lists in descending order
def sortSubredditOccurences(keyList, itemList):
    for i in range(len(itemList)):
        for j in range(i, len(itemList)):
            if itemList[i] < itemList[j]:
                temp = itemList[i]
                itemList[i] = itemList[j]
                itemList[j] = temp
                temp = keyList[i]
                keyList[i] = keyList[j]
                keyList[j] = temp
    return keyList, itemList

# This function takes a list of dictionaries and seperates them into 3 lists based on their sentiment
# Also it adds the sentiment and score to the dictionary
def seperateSentiments(queryList):
    sentimentList = []
    for a in queryList:
        sentimentList.append(a['title'])

    alist = s.analyseSentiment(sentimentList)

    positiveSentimentList = []
    neutralSentimentList = []
    negativeSentimentList = []
    for i in range(len(alist)):
        if(alist[i]['label'] == 'POSITIVE'):
            positiveSentimentList.append(queryList[i])
            queryList[i]['label'] = 'POSITIVE'
            queryList[i]['score'] = alist[i]['score']
        elif(alist[i]['label'] == 'NEUTRAL'):
            neutralSentimentList.append(queryList[i])
            queryList[i]['label'] = 'POSITIVE'
            queryList[i]['score'] = alist[i]['score']
        elif(alist[i]['label'] == 'NEGATIVE'):
            negativeSentimentList.append(queryList[i])
            queryList[i]['label'] = 'POSITIVE'
            queryList[i]['score'] = alist[i]['score']
    return positiveSentimentList, neutralSentimentList, negativeSentimentList

# This function converts the data from the submission object into a dictionary entry
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
            "selftext": submission.selftext
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
            "upvote_ratio": "N/A"
        }
# This function converts the submissions into a list of dictionaries
def createDictList(submissions):
    list = []
    for submission in submissions:
        list.append(dataToDictionary(submission))
    return list

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
        subbredditList.append(post['subreddit'])
        titleList.append(post['title'])
        authorList.append(post['author'])
    return titleList, subbredditList, authorList

