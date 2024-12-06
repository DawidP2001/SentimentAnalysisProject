1. License: Reddit Sentiment Analyzer © 2024 by Dawid Pionk is licensed under GNU General Public License as published by the Free Software Foundation

2. Author: Dawid Pionk

3. Description Of Project: A website that analyses a given topic and displays its sentiment for the user

4. ToDo:
    I.   Charts
    II.  View Posts
    III. Guide Page
    IV.  Add Light and Dark mode
    V.   Extract more Information from the submission object for the table
    VI.  Generate the table of posts
    VII. 
    
5. Potential Issues:
    I.  Fix environmental variables on pythonAnywhere
    II. Fix issue with resizing 

6. Ideas for potential features:
    I.      Analysis for images
    II.     Compare Sentiment
    III.    Accounts
    IV.     Previous Searches
    V.      Forum/Discussion Page
    VI.     Phone website

7. List Of Files:
    I.      Documentation directory - Stores documentation on this project
    II.     Testing Area directory - Used for testing
    III.    Website directory - contains code for the program
    IV.     Website/static directory - Contains the css and js used by flask
    V.      Website/templates directory - Contains html of the site
    VI.     Website/templates/charts.html - html with layout for the chart page
    VII.    Website/templates/extraInformation.html - Used by the index.html to store additional text
    VIII.   Website/templates/form.html - The form used by index.html
    IX.     Website/templates/index.html - The home page of the website
    X.      Website/templates/viewPosts.html - Used by charts.html to display posts
    XI.     Website/Utility directory - Contains different python functions used by flask
    XII.    Website/Utility/Reddit.py - Contains logic for queries to reddits API
    XIII.   Website/Utility/SentimentAnalyzer.py - Contains the model of sentiment analysis
    XIV.    Website/Utility/Utils.py - Miscellaneous functions used by the program
    XV.     Wesbsite/main.py - Main file that runs the program contains flask

8. List Of technologies: Python-Flask, praw, transformers, dotenv

9. How to Run:  Run main.py then go to http://127.0.0.1:5000/

10. Website Link: https://dawidp.pythonanywhere.com/ 