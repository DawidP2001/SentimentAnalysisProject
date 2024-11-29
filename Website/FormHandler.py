from flask import Flask, request, render_template, session
from Utility import Reddit
from Utility import SenitmentAnalyser
from dotenv import load_dotenv
import os

app = Flask(__name__)

load_dotenv()
app.secret_key = os.getenv("Secret_Key")

@app.route('/')
def index():
    return render_template(
            'index.html',
            form=True, 
            charts=False
        )

@app.route('/showCharts', methods=['POST'])
def submit():
    session['search'] = request.form["search"]
    rawData = Reddit.extractData(session['search'])
    session['results'] = SenitmentAnalyser.analyseSentiment(rawData)
    return render_template(
            'index.html',
            form=False, 
            charts=True
        )

if __name__ == '__main__':  
   app.run()  