#Author: Dawid Pionk
#Date: 05/01/2024
#Description: This File stores code required for sentiment analysis of the posts


#This function analyses sentiment of passed in text
#param data: The text to analyse
#return: A list containing the text, Classification and score
def analyseSentiment(data):
    results = []
    i=0
    for text in data:
        results.append({"Text":text, "label": "POSITIVE", "score": 0.9})
        i+=1
    return results