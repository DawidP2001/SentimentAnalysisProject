#Author: Dawid Pionk
#Date: 05/12/2024
#Description: This File stores code required for sentiment analysis of the posts

from transformers import pipeline
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from Utility import DataHandler as d

#This function analyses sentiment of passed in text
#param data: The text to analyse
#return: A list containing the text, Classification and score
def analyseSentiment(data):
    sentiment_pipeline = pipeline(model='cardiffnlp/twitter-roberta-base-sentiment')
    results = sentiment_pipeline(data)
    i=0
    for text in data:
        if results[i]['label'] == 'LABEL_0':
            label = 'NEGATIVE'
        elif results[i]['label'] == 'LABEL_1':
            label = 'NEUTRAL'
        elif results[i]['label'] == 'LABEL_2':
            label = 'POSITIVE'
        results[i] = {"Text":text, "label": label, "score": results[i]['score']}
        i+=1
    return results

def getSentimentScores(data):
    analyzer = SentimentIntensityAnalyzer()
    results = []
    textList = data['title'].tolist()
    for text in textList:
        scores = analyzer.polarity_scores(text)
        label=""
        if(scores['compound']>0.333):
            label = 'POSITIVE'
        elif(scores['compound']<-0.333):
            label = 'NEGATIVE'
        else:
            label = 'NEUTRAL'
        results.append({"text":text, "label": label, "positiveScore": scores['pos'], 
                      "neutralScore": scores['neu'], "negativeScore": scores['neg'], 
                      "compoundScore": scores['compound']})
    return results

################
# CREATE A SENTIMENT ANALYSIS SECTION FOR IMAGES, GIFS AND VIDEOS ETC...
################

