import json
from os import environ as env
from flask import Flask,request,jsonify
from flask import jsonify
from flask import redirect
from flask import render_template
from flask import url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId


app = Flask(__name__, static_url_path='/static', static_folder='./static')


# CONFIGURING MONGO DB:
mongo=PyMongo()
app.config['MONGO_URI']="mongodb+srv://testuser:testpassword@cluster0.kcqy9.mongodb.net/myDB?retryWrites=true&w=majority"
mongo.init_app(app)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/history',methods=["GET","POST"])
def history():
    if request.method == 'POST':
        #SHOW ALL API CALLS HISTORY FROM DB
        if request.form.get('submit_button') == 'Show API Calls History':
            data=mongo.db.bramfitt.find()
            return render_template('history.html' , data=data)

        #GETTING QUERY SEARCH BY VALUE
        if request.form.get('submitBtn') == 'search':
            textValue=request.form['searchDbValue']
            textKey=request.form['searchDbKey']
            data = mongo.db.bramfitt.find({textKey:textValue})
            return render_template('history.html',data=data)

        else:
            return render_template('history.html')

    elif request.method == 'GET':
        return render_template('history.html')


@app.route('/delelement/<objectnumber>', methods = ['POST',"GET"])
def delelement(objectnumber):
    objectnumber=json.loads(objectnumber)
    print(objectnumber)
    mongo.db.bramfitt.delete_one({'_id':ObjectId(objectnumber)})
    return jsonify({'message': 'Success'})


######## Data fetch ############
@app.route('/getdata', methods = ['POST',"GET"])
def getdata():
    jsdata = request.values.get('json')
    data=json.loads(jsdata)

    for i in data:
        mongo.db.bramfitt.insert_one({
            'Timestamp' :i['timestamp'],
            'VehickleID':i['vehicleId'],
            'StationName':i['stationName'],
            'DestinationName':i['destinationName']
            })

    return jsonify({'message': 'Success'})



if __name__ == "__main__":
    app.run(host='127.0.0.1', port=env.get('PORT', 3001),debug=True)