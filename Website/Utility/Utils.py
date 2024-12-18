from collections import Counter

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
        keyList.append(key.display_name)
        itemList.append(subredditCounter[key])

    return keyList, itemList

def seperateSentiments(sentimentList):
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