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
import pandas as pd
import re
import nltk

def countLables(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    resultArray = [len(positiveSentimentList) , len(neutralSentimentList), len(negativeSentimentList)]
    return resultArray

# Converts the return of the counter method into 2
# lists that can be then passed into the javascript function
# used to display the bar chart for unique subreddits
def convertSubOccurencesForJs(subredditCounter):
    maxSize = 25 # Used to set the max size of the subreddit list
    keys = subredditCounter.keys()
    keyList = []
    itemList = []
    for key in keys:
        keyList.append(key)
        itemList.append(subredditCounter[key])
    keyList, itemList = sortSubredditOccurences(keyList, itemList)
    keyList, itemList = reduceSizeOfSubredditList(keyList, itemList, maxSize)
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
# This function reduces the size of the subreddit list to a specific size
def reduceSizeOfSubredditList(keyList, itemList, size):
    if len(keyList) > size:
        keyList = keyList[:size]
        itemList = itemList[:size]
    return keyList, itemList
# This function takes a list of dictionaries and seperates them into 3 lists based on their sentiment
# Also it adds the sentiment and score to the dictionary
def seperateSentiments(queryList):
    sentimentList = []
    # Extracts the titles from the queryList
    for a in queryList:
        sentimentList.append(a['title'])

    # This contains the result of the sentiment as well as the title that was analyzed
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

################################
# Below are functions that deal with processing data to be in the breakdown section 
############################

def getBreakdownData(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    numberOfSubmissions = len(positiveSentimentList) + len(neutralSentimentList) + len(negativeSentimentList)
    if len(positiveSentimentList) !=0:
        positiveBreakdownMap = setBreakDownData(positiveSentimentList, numberOfSubmissions)
    else:
        positiveBreakdownMap = {
            "PercentageOfOverall": 0,
            "AverageScore": "N/A",
            "AverageNumOfComments": "N/A",
            "MostCommonWord": "N/A",
            "AverageNumberOfUpvotes": "N/A",
            "AverageUpvoteRatio": "N/A",
            "MostCommonSubreddit": "N/A"
        }
    if len(neutralSentimentList) != 0:
        neutralBreakdownMap = setBreakDownData(neutralSentimentList, numberOfSubmissions)
    else:
        neutralBreakdownMap = {
            "PercentageOfOverall": 0,
            "AverageScore": "N/A",
            "AverageNumOfComments": "N/A",
            "MostCommonWord": "N/A",
            "AverageNumberOfUpvotes": "N/A",
            "AverageUpvoteRatio": "N/A",
            "MostCommonSubreddit": "N/A"
        }
    if len(negativeSentimentList) != 0:
        negativeBreakdownMap = setBreakDownData(negativeSentimentList, numberOfSubmissions)
    else:
        negativeBreakdownMap = {
            "PercentageOfOverall": 0,
            "AverageScore": "N/A",
            "AverageNumOfComments": "N/A",
            "MostCommonWord": "N/A",
            "AverageNumberOfUpvotes": "N/A",
            "AverageUpvoteRatio": "N/A",
            "MostCommonSubreddit": "N/A"
        }
    return positiveBreakdownMap, neutralBreakdownMap, negativeBreakdownMap

def setBreakDownData(list, numberOfSubmissions):
    percentageOfOverall = (len(list) / numberOfSubmissions) * 100
    averageScore = 0
    averageNumOfComments = 0
    mostCommonWord = "N/A"
    averageNumberOfUpvotes = 0
    averageUpvoteRatio = 0
    mostCommonSubreddit = "N/A"
    numberOfElements = len(list)
    for i in list:
        averageScore += i['score']
        averageNumOfComments += i['num_comments'] + 1
        averageNumberOfUpvotes += i['upvotes']
        averageUpvoteRatio += i['upvote_ratio']

    # This section I get the average for some of the numerical values
    averageScore = (averageScore / numberOfElements) * 100
    averageNumOfComments = averageNumOfComments / numberOfElements
    averageNumberOfUpvotes = (averageNumberOfUpvotes / numberOfElements)
    averageUpvoteRatio = (averageUpvoteRatio / numberOfElements) * 100
    # Here I get round up some of the numerical values
    percentageOfOverall = round(percentageOfOverall, 0)
    averageScore = round(averageScore, 2)
    averageNumOfComments = round(averageNumOfComments, 0)
    averageNumberOfUpvotes = round(averageNumberOfUpvotes, 0)
    averageUpvoteRatio = round(averageUpvoteRatio, 0)

    #Here I Convert from float to int to remove the decimal point
    percentageOfOverall = int(percentageOfOverall)
    averageNumOfComments = int(averageNumOfComments)
    averageNumberOfUpvotes = int(averageNumberOfUpvotes)
    averageUpvoteRatio = int(averageUpvoteRatio)

    # In this section I add a % to some of the values
    averageScore = str(averageScore) + "%"
    averageUpvoteRatio = str(averageUpvoteRatio) + "%"
    breakdownMap = {
        "PercentageOfOverall": percentageOfOverall,
        "AverageScore": averageScore,
        "AverageNumOfComments": averageNumOfComments,
        "MostCommonWord": mostCommonWord,
        "AverageNumberOfUpvotes": averageNumberOfUpvotes,
        "AverageUpvoteRatio": averageUpvoteRatio,
        "MostCommonSubreddit": mostCommonSubreddit
    }
    return breakdownMap

################################
# Below are functions that deal with processing data to be displayed on charts
################################
def getDataForWordCloud(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    wordCounts = countWordOccurences(positiveSentimentList, neutralSentimentList, negativeSentimentList)
    wordCloudData = convertWordCountsForWordCloud(wordCounts)
    return wordCloudData

def countWordOccurences(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    nltk.download('stopwords')
    
    df = convertPostsToDataFrame(positiveSentimentList, neutralSentimentList, negativeSentimentList)
    wordList = []
    stopWords = set(nltk.corpus.stopwords.words('english'))
    for ___, row in df.iterrows():
        wordList.append(row['title'])
    wordString = " ".join(wordList)
    wordString = re.sub(r'[^a-zA-Z\s]', '', wordString).lower()
    words = wordString.split()
    filteredWords = [word for word in words if word not in stopWords]
    wordCounts = Counter(filteredWords)
    return wordCounts

def convertWordCountsForWordCloud(wordCounts):
    wordCloudString = "["
    for word, count in wordCounts.items():
        wordCloudString+= "{word: \"" + word + "\", size: \"" + str(count) + "\"},"
    wordCloudString = wordCloudString[:-1]
    wordCloudString += "]"
    return wordCloudString
##############################
# This section deals with converting the data into a pandas dataframe
################################

##########THIS ISNT BEING USED ANWYHERE ATM ##############
def convertPostsToDataFrame(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    positivedf = pd.DataFrame(positiveSentimentList)
    neutraldf = pd.DataFrame(neutralSentimentList)
    negativedf = pd.DataFrame(negativeSentimentList)
    df = pd.concat([positivedf, neutraldf, negativedf], ignore_index=True)
    return df