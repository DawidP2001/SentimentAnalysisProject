from transformers import pipeline

sentiment_pipeline = pipeline(model='distilbert/distilbert-base-uncased-finetuned-sst-2-english')

def analyseSentiment(data):
    results = sentiment_pipeline(data)
    return results