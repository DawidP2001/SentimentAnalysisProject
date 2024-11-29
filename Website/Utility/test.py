import Reddit
import SenitmentAnalyser

result = Reddit.extractData("Poland")
data = SenitmentAnalyser.analyseSentiment(result)
print(data)
