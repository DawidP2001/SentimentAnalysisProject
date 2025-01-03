from collections import Counter
from Utility import SenitmentAnalyser as s
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

    return keyList, itemList

########### JUST FOR TESTING
def seperateSentimentsTest(sentimentList):
    positiveSentimentList = []
    neutralSentimentList = []
    negativeSentimentList = []

    for value in sentimentList:
        if(value['label'] == 'POSITIVE'):
            positiveSentimentList.append(value)
        if(value['label'] == 'NEUTRAL'):
            neutralSentimentList.append(value)
        if(value['label'] == 'NEGATIVE'):
            negativeSentimentList.append(value)
    return positiveSentimentList, neutralSentimentList, negativeSentimentList

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
    return {
        "title": submission.title,
        "subreddit": submission.subreddit.display_name,
        "author": submission.author.name,
        "created_utc": datetime.datetime.fromtimestamp(submission.created_utc),
        "num_comments": submission.num_comments,
        "over_18": submission.over_18,
        "permalink": submission.permalink,
        "upvotes": submission.score,
        "upvote_ratio": submission.upvote_ratio
    }
# This function converts the submissions into a list of dictionaries
def createDictList(submissions):
    list = []
    for submission in submissions:
        list.append(dataToDictionary(submission))
    return list