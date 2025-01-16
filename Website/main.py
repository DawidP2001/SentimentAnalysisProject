# Author: Dawid Pionk
# Description: 
# Date: 

from flask import Flask, request, render_template, session
from Utility import Reddit as r
#from Utility import SenitmentAnalyser as s
from Utility import Utils
import os
from collections import Counter

app = Flask(__name__)

app.secret_key = os.getenv("Secret_Key")

@app.route('/')
def index():
    return render_template( 
            'index.html',
            form=True, 
            charts=False,
            scrollToContact=False,
            userInformation=False
        )

@app.route('/#contactSection')
def indexContact():
    return render_template( 
            'index.html',
            form=True, 
            charts=False,
            scrollToContact=False,
            userInformation=False
        )

@app.route('/showChartsGeneralSearch', methods=['POST'])
def submitTopic():
    search = request.form["searchTopic"] # This contains the topic from the search
    subreddit = request.form["subredditSearchTopic"] # This contains the subreddit from the search
    querySize = request.form["querySizeTopic"] # This contains the size of the query
    if subreddit != "":
        rawData = r.queryAPI(search, subreddit, querySize)
    else:
        rawData = r.queryAPI(search, "all", querySize) # Contains all the raw data from the query to the Reddit Api
    datalist = Utils.createDictList(rawData) # Contains the data in a list of dictionaries
    titleList, subbredditList, authorList = r.extractData(datalist)
    keyList, itemList = Utils.convertSubOccurencesForJs(Counter(subbredditList))

    positiveSentimentList, neutralSentimentList, negativeSentimentList  =  Utils.seperateSentiments(datalist)
    
    setSessionData(positiveSentimentList, neutralSentimentList, negativeSentimentList, keyList, itemList, search, authorList)

    return render_template(
            'index.html',
            form=False, 
            charts=True,
            scrollToContact=False,
            userInformation=False
        )

@app.route('/showChartsUserSearch', methods=['POST'])
def submitUser():
    user = request.form["searchUser"] # This contains the topic from the search
    rawData = r.queryUser(user) # Contains all the raw data from the query to the Reddit Api
    datalist = Utils.createDictList(rawData) # Contains the data in a list of dictionaries
    titleList, subbredditList, authorList = r.extractData(datalist)
    keyList, itemList = Utils.convertSubOccurencesForJs(Counter(subbredditList))

    positiveSentimentList, neutralSentimentList, negativeSentimentList  =  Utils.seperateSentiments(datalist)
    
    setSessionData(positiveSentimentList, neutralSentimentList, negativeSentimentList, keyList, itemList, user, authorList)

    return render_template(
            'index.html',
            form=False, 
            charts=True,
            scrollToContact=False,
            userInformation=True
        )

@app.route('/showChartsSubredditSearch', methods=['POST'])
def submitSubrredit():
    pass

@app.route('/showChartsPostSearch', methods=['POST'])
def submitPost():
    pass

# This function is used to set session variables
def setSessionData(positiveSentimentList, neutralSentimentList, negativeSentimentList, keyList, itemList, search, authorList):
    session['positiveSentimentList'] = positiveSentimentList
    session['neutralSentimentList'] = neutralSentimentList
    session['negativeSentimentList'] = negativeSentimentList
    session['subKeyList'] = keyList # Contains the keys for subbreddit chart
    session['subItemList'] = itemList # Contains the values for subbreddit chart
    session['search'] = search # Contains the search topic
    session['postTitleSentimentCount'] = Utils.countLables(positiveSentimentList, neutralSentimentList, negativeSentimentList) #Contains the count of sentiment values
    session['authorList'] = authorList


if __name__ == '__main__':  
   app.run()  