#Author: Dawid Pionk
#Date: 05/12/2024
#Description: This File stores code required for sentiment analysis of the posts

from transformers import pipeline

#This function analyses sentiment of passed in text
#param data: The text to analyse
#return: A list containing the text, Classification and score
def analyseSentiment(data):
    sentiment_pipeline = pipeline(model='distilbert/distilbert-base-uncased-finetuned-sst-2-english')
    results = sentiment_pipeline(data)
    i=0
    for text in data:
        results[i] = {"Text":text, "label": results[i]['label'], "score": results[i]['score']}
        i+=1
    return results