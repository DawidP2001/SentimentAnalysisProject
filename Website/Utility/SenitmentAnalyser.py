"""
@file SentimenAnalyser.py
@brief This file contains functions used to analyse sentiment of text using the VADER and RoBERTa models.
@date 27/04/2025
@author Dawid Pionk
"""

from transformers import pipeline
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from Utility import DataHandler as d

def analyseSentiment(data):
    """
    @brief This function analyses sentiment of passed in text using the RoBERTa model.

    @param data - The text to analyse.

    @return A list containing the text, Classification and score.
    """
    sentiment_pipeline = pipeline(model='cardiffnlp/twitter-roberta-base-sentiment')
    results = sentiment_pipeline(data)
    i=0
    for text in data:
        label=results[i]['label']
        results[i] = {"Text":text, "robertaLabel": label, "robertaConfidenceScore": results[i]['score']}
        i+=1
    return results

def getSentimentScores(data):
    """
    @brief This function analyzes the sentiment of post titles and text and returns sentiment scores.

    @param data - A DataFrame containing Reddit post data, where the 'title' column will be used for sentiment analysis.

    @return A list of dictionaries, each containing the initial data with sentiment scores and labels.
    """
    max_length = 512  # Set a maximum length for the combined text
    textList = ((data['title'] + " " + data['selftext']).str[:max_length]).tolist()  # Truncate combined text
    robertaResults = analyseSentiment(textList)

    analyzer = SentimentIntensityAnalyzer()
    results = []
    textList = (data['title'] + " " + data['selftext']).tolist()
    # Combine titles and selftext for sentiment analysis
    i=0
    for text in textList:
        scores = analyzer.polarity_scores(text)
        label=""
        if(robertaResults[i]['robertaLabel'] == 'LABEL_0'):
            label = 'NEGATIVE'
        elif(robertaResults[i]['robertaLabel'] == 'LABEL_1'):
            label = 'NEUTRAL'
        elif(robertaResults[i]['robertaLabel'] == 'LABEL_2'):
            label = 'POSITIVE'
        results.append({"text":text, "label": label, "positiveScore": scores['pos'], 
                      "neutralScore": scores['neu'], "negativeScore": scores['neg'], 
                      "compoundScore": scores['compound']})
        i+=1
    return results

################
# CREATE A SENTIMENT ANALYSIS SECTION FOR IMAGES, GIFS AND VIDEOS ETC...
################

