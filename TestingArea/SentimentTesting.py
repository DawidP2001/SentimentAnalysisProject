from transformers import pipeline
sentiment_pipeline = pipeline(model="finiteautomata/bertweet-base-sentiment-analysis")
data = ["I love you", "I hate you"]
results = sentiment_pipeline(data)
print(results)