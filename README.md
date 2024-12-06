1. License: Reddit Sentiment Analyzer © 2024 by Dawid Pionk is licensed under GNU General Public License as published by the Free Software Foundation

2. Author: Dawid Pionk

3. Description Of Project: A website that analyses a given topic and displays its sentiment for the user

4. ToDo: <br>
    I.   Charts<br>
    II.  View Posts<br>
    III. Guide Page<br>
    IV.  Add Light and Dark mode<br>
    V.   Extract more Information from the submission object for the table<br>
    VI.  Generate the table of posts
    
5. Potential Issues:<br>
    I.  Fix environmental variables on pythonAnywhere<br>
    II. Fix issue with resizing

6. Ideas for potential features:<br>
    I.      Analysis for images<br>
    II.     Compare Sentiment<br>
    III.    Accounts<br>
    IV.     Previous Searches<br>
    V.      Forum/Discussion Page<br>
    VI.     Phone website<br>

7. List Of Files:<br>
    I.      Documentation directory - Stores documentation on this project<br>
    II.     Testing Area directory - Used for testing<br>
    III.    Website directory - contains code for the program<br>
    IV.     Website/static directory - Contains the css and js used by flask<br>
    V.      Website/templates directory - Contains html of the site<br>
    VI.     Website/templates/charts.html - html with layout for the chart page<br>
    VII.    Website/templates/extraInformation.html - Used by the index.html to store additional text<br>
    VIII.   Website/templates/form.html - The form used by index.html<br>
    IX.     Website/templates/index.html - The home page of the website<br>
    X.      Website/templates/viewPosts.html - Used by charts.html to display posts<br>
    XI.     Website/Utility directory - Contains different python functions used by flask<br>
    XII.    Website/Utility/Reddit.py - Contains logic for queries to reddits API<br>
    XIII.   Website/Utility/SentimentAnalyzer.py - Contains the model of sentiment analysis<br>
    XIV.    Website/Utility/Utils.py - Miscellaneous functions used by the program<br>
    XV.     Wesbsite/main.py - Main file that runs the program contains flask

8. List Of technologies: Python-Flask, praw, transformers, dotenv

9. How to Run:  Run main.py then go to http://127.0.0.1:5000/

10. Website Link: https://dawidp.pythonanywhere.com/ 