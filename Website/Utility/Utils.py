"""
@file Utils.py
@brief This file contains functions that are used for several miscellaneous tasks, such as data processing, sentiment analysis, and Google Trends retrieval.
@date 28/04/2025
@author Dawid Pionk
"""

from collections import Counter
import logging
import praw
from Utility import SenitmentAnalyser as s
import datetime
import pandas as pd
import re
import nltk

def countLables(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    """
    @brief This function counts the number of items in the provided sentiment lists.

    @param positiveSentimentList - A list containing posts or comments labeled as positive sentiment.
    @param neutralSentimentList - A list containing posts or comments labeled as neutral sentiment.
    @param negativeSentimentList - A list containing posts or comments labeled as negative sentiment.

    @return A list containing the counts of positive, neutral, and negative sentiment items in the respective lists.
    """
    resultArray = [len(positiveSentimentList) , len(neutralSentimentList), len(negativeSentimentList)]
    return resultArray

def convertSubOccurencesForJs(subredditCounter):
    """
    @brief This function converts subreddit occurrences for use in JavaScript visualization.

    Converts the return of the counter method into 2 lists that can be then passed into the javascript function
    used to display the bar chart for unique subreddits

    @param subredditCounter - A dictionary containing subreddit names as keys and their respective occurrence counts as values.

    @return A tuple containing two lists: 
            - The first list contains the sorted subreddit names.
            - The second list contains the sorted occurrence counts, aligned with the subreddits.
    """
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

def sortSubredditOccurences(keyList, itemList):
    """
    @brief Sorts the items in the lists in descending order

    @param keyList - A list of subreddit names.
    @param itemList - A list of corresponding occurrence counts for each subreddit.

    @return A tuple containing:
            - The sorted list of subreddit names (`keyList`).
            - The sorted list of occurrence counts (`itemList`), in descending order.
    """
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

def reduceSizeOfSubredditList(keyList, itemList, size):
    """
    @brief This function reduces the size of the subreddit list to a specific size

    @param keyList - A list of subreddit names to be reduced.
    @param itemList - A list of corresponding occurrence counts for each subreddit.
    @param size - The maximum size to which the lists should be reduced.

    @return A tuple containing:
            - The list of subreddit names (`keyList`).
            - The list of occurrence counts (`itemList`)
    """
    if len(keyList) > size:
        keyList = keyList[:size]
        itemList = itemList[:size]
    return keyList, itemList

def seperateSentiments(queryList):
    """
    @brief This function takes a list of dictionaries and seperates them into 3 lists based on their sentiment

    @param queryList - A list of dictionaries where each dictionary contains information about a post, including a 'title' field that will be analyzed for sentiment.

    @return A tuple containing three lists:
            - `positiveSentimentList`: A list of posts with a positive sentiment.
            - `neutralSentimentList`: A list of posts with a neutral sentiment.
            - `negativeSentimentList`: A list of posts with a negative sentiment.
    """
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

def dataToDictionary(submission):
    """
    @brief This function converts the data from the submission object into a dictionary entry

    @param submission - A Reddit submission or comment object to be converted to a dictionary

    @return A dictionary containing key attributes of the submission or comment
    """
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
def createDictList(submissions):
    """
    @brief This function converts the submissions into a list of dictionaries

    @param submission - A Reddit submission or comment object to be converted to a dictionary

    @return A dlist of dictionaries containing key attributes of the submission or comment
    """    
    list = []
    for submission in submissions:
        list.append(dataToDictionary(submission))
    return list

def extractPostTitles(query):
    """
    @brief This function extracts the titles of the posts from query

    @param query - A list of Reddit posts or comments from which titles will be extracted.

    @return A list of titles from the provided posts or comments.
    """
    resultList = []
    for post in query:
        resultList.append(post.title)
    return resultList

def extractPostSubreddits(results):
    """
    @brief This function extracts the subreddits from the results of the query

    @param results - A list of Reddit posts or comments from which subreddit information will be extracted.

    @return A list of subreddits from the provided posts or comments.
    """
    resultList = []
    for post in results:
        resultList.append(post.subreddit)
    return resultList

def extractData(results):
    """
    @brief This function extracts specific information from the results of a query

    @param results - A list of Reddit posts or comments from which titles, subreddits, and authors will be extracted.

    @return A tuple containing three lists: 
            - A list of post titles
            - A list of subreddits
            - A list of authors
    """
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
# Note: Currently unused switched to processing this data in the front end instead
################################

def getBreakdownData(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    """
    @brief NOT IN USE ANYMORE, THIS FUNCTION IS NOT USED ANYWHERE IN THE CODE
    """
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
    """
    @brief NOT IN USE ANYMORE, THIS FUNCTION IS NOT USED ANYWHERE IN THE CODE
    """
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
    """
    @brief NOT IN USE ANYMORE, THIS FUNCTION IS NOT USED ANYWHERE IN THE CODE
    """
    wordCounts = countWordOccurences(positiveSentimentList, neutralSentimentList, negativeSentimentList)
    wordCloudData = convertWordCountsForWordCloud(wordCounts)
    return wordCloudData

def countWordOccurences(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    """
    @brief NOT IN USE ANYMORE, THIS FUNCTION IS NOT USED ANYWHERE IN THE CODE
    """
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
    """
    @brief NOT IN USE ANYMORE, THIS FUNCTION IS NOT USED ANYWHERE IN THE CODE
    """
    wordCloudString = "["
    for word, count in wordCounts.items():
        wordCloudString+= "{\"word\": \"" + word + "\", \"size\": \"" + str(count) + "\"},"
    wordCloudString = wordCloudString[:-1]
    wordCloudString += "]"
    return wordCloudString
##############################
# This section deals with converting the data into a pandas dataframe
################################
def convertPostsToDataFrame(positiveSentimentList, neutralSentimentList, negativeSentimentList):
    """
    @brief This function converts the data into a pandas dataframe

    @param positiveSentimentList - A list of positive sentiment posts to be converted into a DataFrame.
    @param neutralSentimentList - A list of neutral sentiment posts to be converted into a DataFrame.
    @param negativeSentimentList - A list of negative sentiment posts to be converted into a DataFrame.

    @return A DataFrame containing all the posts from the three sentiment lists.
    """
    positivedf = pd.DataFrame(positiveSentimentList)
    neutraldf = pd.DataFrame(neutralSentimentList)
    negativedf = pd.DataFrame(negativeSentimentList)
    df = pd.concat([positivedf, neutraldf, negativedf], ignore_index=True)
    return df

################################
# This section deals with getting topics that are trending, so they could be displayed on the
# trending section
################################

def getGoogleTrendsPytrends() -> list:
    """
        Gets the trenidng topics from google trends using the pytrends library
        Note: This method no longer used since pytrends is not working properly, switched to using feedparser

        Returns: 
            list: 4 lists of trending topics worldwide, in Ireland, in the UK and in the US
    """
    
    from pytrends.request import TrendReq
    try:
        pytrends = TrendReq(hl='en-GB', tz=360)
        worldwideTrending = pytrends.trending_searches()
        irelandTrending = pytrends.trending_searches(pn='ireland')
        ukTrending = pytrends.trending_searches(pn='united_kingdom')
        usTrending = pytrends.trending_searches(pn='united_states')
        worldwideTrendingList = worldwideTrending[0].tolist()
        irelandTrendingList = irelandTrending[0].tolist()
        ukTrendingList = ukTrending[0].tolist()
        usTrendingList = usTrending[0].tolist()
        return worldwideTrendingList, irelandTrendingList, ukTrendingList, usTrendingList
    except Exception as e:
        print("Utils.getGoogleTrend() Failed :" + str(e))
        return ["Google Trend Failed"], [], [], []


def getGoogleTrendingTopics() -> list[list, list, list, list]:
    """
    Gets the trenidng topics from google trends using the feedparser library

    Returns: 
        list[list, list, list, list]: 4 lists of trending topics worldwide, in Ireland, in the UK and in the US
    """
    import feedparser
    from feedparser import FeedParserDict
    def getGoogleTrendingList(feed: FeedParserDict) -> list:
        """
            Gets the trending topics from the feedparser dictionary

            Args:
                feed (FeedParserDict): The feedparser dictionary
            Returns: 
                list: A list of trending topics
        """
        googleList = []
        for entry in feed.entries:
            googleList.append(entry.title)
        return googleList
    # Google Trends RSS feed for the U.S.
    try:
        rss_url_worldwide = "https://trends.google.com/trending/rss?geo=US"
        rss_url_ireland = "https://trends.google.com/trending/rss?geo=IE"
        rss_url_uk = "https://trends.google.com/trending/rss?geo=GB"
        rss_url_us = "https://trends.google.com/trending/rss?geo=US"
        
        feedWorldwide = feedparser.parse(rss_url_worldwide)
        feedIreland = feedparser.parse(rss_url_ireland)
        feedUK = feedparser.parse(rss_url_uk)
        feedUS = feedparser.parse(rss_url_us)

        worldwideTrendingList = getGoogleTrendingList(feedWorldwide)
        irelandTrendingList = getGoogleTrendingList(feedIreland)  
        ukTrendingList = getGoogleTrendingList(feedUK)
        usTrendingList = getGoogleTrendingList(feedUS)

        return [worldwideTrendingList, irelandTrendingList, ukTrendingList, usTrendingList]
    except Exception as e:
        logging.error(f"getGoogleTrendingTopics() Failed: {e}")
        return [[], [], [], []]  # Return empty lists instead of a placeholder message