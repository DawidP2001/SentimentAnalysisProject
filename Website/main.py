# Author: Dawid Pionk
# Description: 
# Date: 

from flask import Flask, request, render_template, session
from Utility import Reddit as r
from Utility import Utils
import os
from collections import Counter

app = Flask(__name__)

app.secret_key = os.getenv("Secret_Key")

# This is the default page that gets opened when the website is accessed
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

# This function is used to show the results of a topic search
@app.route('/showChartsGeneralSearch', methods=['POST'])
def submitTopic():
    # Below extracts data from the form
    search = request.form["searchTopic"] # This contains the topic from the search
    subreddit = request.form["subredditSearchTopic"] # This contains the subreddit from the search
    querySize = request.form["querySizeTopic"] # This contains the size of the query
    if subreddit != "":
        rawData = r.queryAPI(search, subreddit, querySize)
    else:
########### Change this so that random posts are taken from random subrreddits instead from all ##########
        rawData = r.queryAPI(search, "all", querySize) # Contains all the raw data from the query to the Reddit Api

    # Below prepares the data for the page to be displayed
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

# This function is used to show the results of a user search	
@app.route('/showChartsUserSearch', methods=['POST'])
def submitUser():
    # Below extracts data from the form
    user = request.form["searchUser"] # This contains the topic from the search
    typeOfPost = request.form["postTypeRadioUser"] # This contains the subreddit from the search
    typeOfSearch = request.form["typeOfSearchUser"] # This contains the subreddit from the search
    searchTimeFrame = request.form["searchTimeFrameUser"] # This contains the subreddit from the search
    querySize = request.form["querySizeUser"]
    # Contains all the raw data from the query to the Reddit Api
    rawData = r.queryUser(user, typeOfPost, typeOfSearch, searchTimeFrame, querySize) 

    # Below prepares the data for the page to be displayed
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

# This function is used to show the results of a subreddit search
@app.route('/showChartsSubredditSearch', methods=['POST'])
def submitSubrredit():
    # Below extracts data from the form
    subreddit = request.form["searchSubreddit"] # This contains the topic from the search
    searchType = request.form["typeOfSearchSubreddit"] # This contains the subreddit from the search
    querySize = request.form["querySizeSubreddit"] # This contains the size of the query
    searchTimeFrame = request.form["searchTimeFrameSubreddit"] # This contains the size of the query
    rawData = r.querySubreddit(subreddit, searchType, querySize, searchTimeFrame) # Contains all the raw data from the query to the Reddit Api
    
    # Below prepares the data for the page to be displayed
    datalist = Utils.createDictList(rawData) # Contains the data in a list of dictionaries
    titleList, subbredditList, authorList = r.extractData(datalist)
    keyList, itemList = Utils.convertSubOccurencesForJs(Counter(subbredditList))
    positiveSentimentList, neutralSentimentList, negativeSentimentList  =  Utils.seperateSentiments(datalist)
    setSessionData(positiveSentimentList, neutralSentimentList, negativeSentimentList, keyList, itemList, subreddit, authorList)
    #setRedditorData(redditor)

    return render_template(
            'index.html',
            form=False, 
            charts=True,
            scrollToContact=False,
            userInformation=False
        )

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

# Sets the session variables for redditor data
def setRedditorData(redditor):
    session["redditorCommentKarma"] = redditor.comment_karma

    session["redditorCreatedUTC"] = redditor.created_utc
    session["redditorHasVerifiedEmail"] = redditor.has_verified_email
    session["redditorID"] = redditor.id
    session["redditorIsEmployee"] = redditor.is_employee
    session["redditorIsMod"] = redditor.is_mod
    session["redditorIsGold"] = redditor.is_gold
    session["redditorIsSuspended"] = redditor.is_suspended
    session["redditorLinkKarma"] = redditor.link_karma
    session["redditorName"] = redditor.name

if __name__ == '__main__':  
   app.run()  