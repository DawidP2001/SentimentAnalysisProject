from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def submit():
    search = request.form["search"]
    return render_template('index.html', alert_message=search)

if __name__ == '__main__':  
   app.run()  