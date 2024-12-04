from flask import Flask, request, render_template, session
from Utility import Reddit
#from Utility import SenitmentAnalyser
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
            charts=False
        )

@app.route('/showCharts', methods=['POST'])
def submit():
    session['search'] = request.form["searchTopic"] # This contains the topic from the search
    rawData = Reddit.queryAPI(session['search']) # Contains all the raw data from the query to the Reddit Api
    subreddits = Reddit.extractPostSubreddits(rawData)
    keyList, itemList = Utils.convertSubOccurencesForJs(Counter(subreddits))
    session['subKeyList'] = keyList
    session['subItemList'] = itemList

    #postTitleList = Reddit.(extractPostTitles(rawData))
    #session['postTitleSentimentCount'] = SenitmentAnalyser.analyseSentiment(postTitleList)
    
    dict= [{'label': 'POSITIVE', 'score': 0.862794041633606}, {'label': 'NEGATIVE', 'score': 0.9901227355003357}, {'label': 'POSITIVE', 'score': 0.998646080493927}, {'label': 'NEGATIVE', 'score': 0.9952049255371094}, {'label': 'POSITIVE', 'score': 0.5903245806694031}, {'label': 'NEGATIVE', 'score': 0.9997323155403137}, {'label': 'NEGATIVE', 'score': 0.9977611303329468}, {'label': 'NEGATIVE', 'score': 0.9785110354423523}, {'label': 'NEGATIVE', 'score': 0.9872662425041199}, {'label': 'NEGATIVE', 'score': 0.9374068975448608}]
    session['postTitleSentimentCount'] = Utils.countLables(dict)
    return render_template(
            'index.html',
            form=False, 
            charts=True
        )

if __name__ == '__main__':  
   app.run()  