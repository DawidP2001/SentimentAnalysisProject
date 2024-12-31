from flask import Flask, request, render_template, session
from Utility import Reddit as r
from Utility import SenitmentAnalyser as s
from Utility import Utils
import os
from collections import Counter

search = "Poland"
rawData = r.queryAPI(search) # Contains all the raw data from the query to the Reddit Api
#sentimentList = [{'Text': 'Multiple far right/facist protestors seen in Poland today.', 'label': 'NEGATIVE', 'score': 0.7135903835296631}, {'Text': 'American guy in Poland calls Indian racial slurs and most invasive species', 'label': 'NEGATIVE', 'score': 0.9918959736824036}, {'Text': 'Poland when Russia violates their airspace.', 'label': 'NEGATIVE', 'score': 0.9741829037666321}, {'Text': '“You forgot Poland”: criticism as US, UK, France and Germany meet alone to discuss Ukraine', 'label': 'NEGATIVE', 'score': 0.9898450374603271}, {'Text': 'Crowley the gnome deported from Poland and banned from entering EU for 10 years', 'label': 'NEGATIVE', 'score': 0.9892055988311768}, {'Text': 'How DID Poland become safe?', 'label': 'NEGATIVE', 'score': 0.9966275095939636}, {'Text': 'Poland tells Ukraine to exhume second world war victims even amid Russia’s invasion', 'label': 'POSITIVE', 'score': 0.969015896320343}, {'Text': 'Moving from Australia to Poland, are we crazy?', 'label': 'NEGATIVE', 'score': 0.9575971961021423}, {'Text': 'How would you describe your experiences in Poland?', 'label': 'NEGATIVE', 'score': 
#    0.9826070666313171}, {'Text': 'Poland seeks British help to protect Ukraine after Trump win', 'label': 'NEGATIVE', 'score': 0.9199395775794983}]
datalist = []
for post in rawData:
    datalist.append(post)

sentimentList = []
for a in datalist:
    sentimentList.append(a.title)

alist = s.analyseSentiment(sentimentList)

positiveSentimentList = []
neutralSentimentList = []
negativeSentimentList = []
for i in range(len(alist)):
    if(alist[i]['label'] == 'POSITIVE'):
        positiveSentimentList.append(datalist[i])
    elif(alist[i]['label'] == 'NEUTRAL'):
        neutralSentimentList.append(datalist[i])
    elif(alist[i]['label'] == 'NEGATIVE'):
        negativeSentimentList.append(datalist[i])
    print(datalist[i].title + " " + alist[i]['label'])