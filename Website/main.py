# Author: Dawid Pionk
# Description:
# Date: 

from flask import Flask, request, render_template, session
from Utility import Reddit as r
from Utility import SenitmentAnalyser as s
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
            scrollToContact=False
        )

@app.route('/#contactSection')
def indexContact():
    return render_template( 
            'index.html',
            form=True, 
            charts=False,
            scrollToContact=True
        )

@app.route('/showCharts', methods=['POST'])
def submit():
    search = request.form["searchTopic"] # This contains the topic from the search
    rawData = r.queryAPI(search) # Contains all the raw data from the query to the Reddit Api
    titleList, subbredditList = r.extractData(rawData)
    keyList, itemList = Utils.convertSubOccurencesForJs(Counter(subbredditList))
    

    sentimentList = s.analyseSentiment(titleList) # Contains the result of sentiment analysis

    ######### JUST FOR TESTING
   # sentimentList = [{'Text': 'Multiple far right/facist protestors seen in Poland today.', 'label': 'NEGATIVE', 'score': 0.7135903835296631}, {'Text': 'American guy in Poland calls Indian racial slurs and most invasive species', 'label': 'NEGATIVE', 'score': 0.9918959736824036}, {'Text': 'Poland when Russia violates their airspace.', 'label': 'NEGATIVE', 'score': 0.9741829037666321}, {'Text': '“You forgot Poland”: criticism as US, UK, France and Germany meet alone to discuss Ukraine', 'label': 'NEGATIVE', 'score': 0.9898450374603271}, {'Text': 'Crowley the gnome deported from Poland and banned from entering EU for 10 years', 'label': 'NEGATIVE', 'score': 0.9892055988311768}, {'Text': 'How DID Poland become safe?', 'label': 'NEGATIVE', 'score': 0.9966275095939636}, {'Text': 'Poland tells Ukraine to exhume second world war victims even amid Russia’s invasion', 'label': 'POSITIVE', 'score': 0.969015896320343}, {'Text': 'Moving from Australia to Poland, are we crazy?', 'label': 'NEGATIVE', 'score': 0.9575971961021423}, {'Text': 'How would you describe your experiences in Poland?', 'label': 'NEGATIVE', 'score': 
#0.9826070666313171}, {'Text': 'Poland seeks British help to protect Ukraine after Trump win', 'label': 'NEGATIVE', 'score': 0.9199395775794983}]
    #########

    positiveSentimentList, neutralSentimentList, negativeSentimentList  = Utils.seperateSentiments(sentimentList)
    session['sentimentList'] = sentimentList
    session['positiveSentimentList'] = positiveSentimentList
    session['neutralSentimentList'] = neutralSentimentList
    session['negativeSentimentList'] = negativeSentimentList
    session['subKeyList'] = keyList # Contains the keys for subbreddit chart
    session['subItemList'] = itemList # Contains the values for subbreddit chart
    session['search'] = search # Contains the search topic
    session['postTitleSentimentCount'] = Utils.countLables(session['sentimentList']) #Contains the count of sentiment values
    return render_template(
            'index.html',
            form=False, 
            charts=True,
            scrollToContact=False
        )

if __name__ == '__main__':  
   app.run()  