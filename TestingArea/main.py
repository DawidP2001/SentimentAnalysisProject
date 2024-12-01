import Reddit as r

query = r.queryAPI("Poland")

for submission in query:
    print(vars(submission))
    break  # Check attributes of the first result only
