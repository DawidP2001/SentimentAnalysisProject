"""
@file main.py
@brief This file is the main entry point for the Sentiment Analysis Project.
@details It manages the Flask application, routes, and interactions with the Reddit API and other utilities.
@date 28/04/2025
@author Dawid Pionk
"""

import datetime
from flask import Flask, request, render_template, session, send_file
from Utility import Reddit as r
from Utility import Utils
from Utility import DataHandler as d
import os
import logging
import pandas as pd

app = Flask(__name__)

app.secret_key = os.getenv("Secret_Key")

@app.route('/')
def index():
    """
    This function is used to show the default page.

    @return Rendered HTML template for the index page.
    """
    googleTrendingTopics = Utils.getGoogleTrendingTopics()
    worldwideTrendingList = googleTrendingTopics[0]
    irelandTrendingList = googleTrendingTopics[1]
    ukTrendingList = googleTrendingTopics[2]
    usTrendingList = googleTrendingTopics[3]
    return render_template( 
            'index.html',
            form=True, 
            charts=False,
            scrollToTrending=False,
            scrollToAbout=False,
            userInformation=False,
            worldwideTrendingList=worldwideTrendingList,
            irelandTrendingList=irelandTrendingList,
            ukTrendingList=ukTrendingList,
            usTrendingList=usTrendingList
        )

@app.route('/Trending')
def scrollToTrending():
    """
    This function is used to scroll to the the trending section on the main page

    @return Rendered HTML template for the index page at the trending section.
    """
    googleTrendingTopics = Utils.getGoogleTrendingTopics()
    worldwideTrendingList = googleTrendingTopics[0]
    irelandTrendingList = googleTrendingTopics[1]
    ukTrendingList = googleTrendingTopics[2]
    usTrendingList = googleTrendingTopics[3]
    return render_template( 
            'index.html',
            form=True, 
            charts=False,
            scrollToTrending=True,
            scrollToAbout=False,
            userInformation=False,
            worldwideTrendingList=worldwideTrendingList,
            irelandTrendingList=irelandTrendingList,
            ukTrendingList=ukTrendingList,
            usTrendingList=usTrendingList
        )

@app.route('/About')
def scrollToAbout():
    """
    This function is used to scroll to the the about section on the main page

    @return Rendered HTML template for the index page at the about section.
    """
    googleTrendingTopics = Utils.getGoogleTrendingTopics()
    worldwideTrendingList = googleTrendingTopics[0]
    irelandTrendingList = googleTrendingTopics[1]
    ukTrendingList = googleTrendingTopics[2]
    usTrendingList = googleTrendingTopics[3]
    return render_template( 
            'index.html',
            form=True, 
            charts=False,
            scrollToTrending=False,
            scrollToAbout=True,
            userInformation=False,
            worldwideTrendingList=worldwideTrendingList,
            irelandTrendingList=irelandTrendingList,
            ukTrendingList=ukTrendingList,
            usTrendingList=usTrendingList
        )

# This function is used to show the results of a topic search
@app.route('/showChartsGeneralSearch', methods=['POST'])
def submitTopic():
    """
    This function is used to collect data from the main page form and display the sentiment analysis page for a topic.

    @return Rendered HTML template for the sentiment analysis page for a topic.
    """
    # Below extracts data from the form
    search = request.form["searchTopic"] # This contains the topic from the search
    subreddit = request.form["subredditSearchTopic"] # This contains the subreddit from the search
    querySize = request.form["querySizeTopic"] # This contains the size of the query
    if subreddit != "":
        rawData = r.queryAPI(search, subreddit, querySize)
    else:
      rawData = r.queryAPI(search, "all", querySize) # Contains all the raw data from the query to the Reddit Api
    data = d.extractData(rawData)
    jsonData = d.converDataToJSON(data)

    return render_template(
            'index.html',
            form=False, 
            charts=True,
            scrollToTrending=False,
            scrollToAbout=False,
            userInformation=False,
            jsonData = jsonData,
            search = search
        )

# This function is used to show the results of a user search	
@app.route('/showChartsUserSearch', methods=['POST'])
def submitUser():
    """
    This function is used to collect data from the main page form and display the sentiment analysis page for a user.

    @return Rendered HTML template for the sentiment analysis page for a user.
    """
    # Below extracts data from the form
    user = request.form["searchUser"] # This contains the topic from the search
    typeOfPost = request.form["postTypeRadioUser"] # This contains the subreddit from the search
    typeOfSearch = request.form["typeOfSearchUser"] # This contains the subreddit from the search
    searchTimeFrame = request.form["searchTimeFrameUser"] # This contains the subreddit from the search
    querySize = request.form["querySizeUser"]
    # Contains all the raw data from the query to the Reddit Api
    redditor = r.getRedditor(user)
    redditorData = d.redditorToDictionary(redditor)
    rawData = r.queryUser(redditor, typeOfPost, typeOfSearch, searchTimeFrame, querySize) 

    # Below prepares the data for the page to be displayed
    data = d.extractData(rawData)
    jsonData = d.converDataToJSON(data)

    return render_template(
            'index.html',
            form=False, 
            charts=True,
            scrollToTrending=False,
            scrollToAbout=False,
            userInformation=True,
            jsonData = jsonData,
            search = user,
            redditorData = redditorData
        )

# This function is used to show the results of a subreddit search
@app.route('/showChartsSubredditSearch', methods=['POST'])
def submitSubrredit():
    """
    This function is used to collect data from the main page form and display the sentiment analysis page for a subreddit.

    @return Rendered HTML template for the sentiment analysis page for a subreddit.
    """
    # Below extracts data from the form
    subreddit = request.form["searchSubreddit"] # This contains the topic from the search
    searchType = request.form["typeOfSearchSubreddit"] # This contains the subreddit from the search
    querySize = request.form["querySizeSubreddit"] # This contains the size of the query
    searchTimeFrame = request.form["searchTimeFrameSubreddit"] # This contains the size of the query
    rawData = r.querySubreddit(subreddit, searchType, querySize, searchTimeFrame) # Contains all the raw data from the query to the Reddit Api
    
    # Below prepares the data for the page to be displayed
    data = d.extractData(rawData)
    jsonData = d.converDataToJSON(data)
    return render_template(
            'index.html',
            form=False, 
            charts=True,
            scrollToTrending=False,
            scrollToAbout=False,
            userInformation=False,
            jsonData = jsonData,
            search = subreddit
        )

@app.route('/showChartsCommentSearch', methods=['POST'])
def submitComment():
    """
    This function is used to collect data from the main page form and display the sentiment analysis page for a comment.

    @return Rendered HTML template for the sentiment analysis page for a post.
    """
    # Below extracts data from the form
    searchType = request.form["typeOfSearchComment"] # This contains the topic from the search
    contents = request.form["searchComment"] # This contains the subreddit from the search
    sortBy = request.form['sortByComments'] # 
    querySize = request.form["querySizeComment"] # This contains the size of the query
    rawData = r.queryComment(searchType, contents, sortBy, querySize) # Contains all the raw data from the query to the Reddit Api
    data = d.extractData(rawData)
    jsonData = d.converDataToJSON(data)
    return render_template(
            'index.html',
            form=False, 
            charts=True,
            scrollToTrending=False,
            scrollToAbout=False,
            userInformation=False,
            jsonData = jsonData,
            search = "Post Comments"
        )

@app.route('/showChartsDomainSearch', methods=['POST'])
def submitDomain():
    """
    This function is used to collect data from the main page form and display the sentiment analysis page for a domain.

    @return Rendered HTML template for the sentiment analysis page for a domain.
    """
    # Below extracts data from the form
    searchContents = request.form["searchDomain"] # This contains the topic from the search
    typeOfSearch = request.form["typeOfSearchDomain"] # This contains the subreddit from the search
    searchTimeFrame = request.form['searchTimeFrameDomain'] # 
    querySize = request.form["querySizeDomain"] # This contains the size of the query
    rawData = r.queryDomain(searchContents, typeOfSearch, searchTimeFrame, querySize) # Contains all the raw data from the query to the Reddit Api
    # Below prepares the data for the page to be displayed
    data = d.extractData(rawData)
    jsonData = d.converDataToJSON(data)

    return render_template(
            'index.html',
            form=False, 
            charts=True,
            scrollToTrending=False,
            scrollToAbout=False,
            userInformation=False,
            jsonData = jsonData,
            search = searchContents
        )


if __name__ == '__main__':  
   app.run()  