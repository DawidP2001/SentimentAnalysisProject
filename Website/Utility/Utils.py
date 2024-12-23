from collections import Counter
from Utility import SenitmentAnalyser as s

def countLables(values):
    resultArray = [0,0,0]
    for value in values:
        if(value['label'] == 'POSITIVE'):
            resultArray[0] = resultArray[0]+1
        if(value['label'] == 'NEUTRAL'):
            resultArray[1] = resultArray[1]+1
        if(value['label'] == 'NEGATIVE'):
            resultArray[2] = resultArray[2]+1
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
    print("hi")
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
        "author": submission.author.name
    }
# This function converts the submissions into a list of dictionaries
def createDictList(submissions):
    list = []
    for submission in submissions:
        list.append(dataToDictionary(submission))
    return list