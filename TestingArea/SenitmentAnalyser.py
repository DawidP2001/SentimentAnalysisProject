from transformers import pipeline

def analyseSentiment(data):
    sentiment_pipeline = pipeline(model='distilbert/distilbert-base-uncased-finetuned-sst-2-english')
    results = sentiment_pipeline(data)
    i=0
    for text in data:
        print(text)
        results[i] = {"Text":text, "label": results[i]['label'], "score": results[i]['score']}
        i+=1
    return results