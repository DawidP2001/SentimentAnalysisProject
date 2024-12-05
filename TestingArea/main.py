import Reddit as r
import SenitmentAnalyser as s

query = r.queryAPI("Poland")
titles = r.extractPostTitles(query)
results = s.analyseSentiment(titles)
print(results)
