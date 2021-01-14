from flask import Flask
from flask import render_template
from flask import request
from pony.orm import *
import json
import logging
import sqlite3

app = Flask(__name__)

db = Database()
db.bind('sqlite', 'data.db',create_db=True )

class Messages(db.Entity):
    id = PrimaryKey(int, auto=True)
    text = Required(str)
    username = Required(str)

db.generate_mapping(create_tables=True)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/all')
@db_session
def all():
    all_messages = select (e for e in Messages)[:]
    return render_template('all.html', all_messages=all_messages)

@app.route('/add')
def add():
    return render_template('add.html')

@app.route('/register', methods=['POST'])
@db_session
def register():
    new_message = Messages(
        text = request.form['Text'],
        username = request.form['Username'],
    )
    commit()
    return render_template('submit.html')

@app.route('/update', methods=['POST'])
@db_session
def update():
    message = Messages[request.form['id']]
    message.text = request.form['Text']
    message.username = request.form['Username']
    commit()

    return render_template('submit.html')

@app.route('/postmethod', methods = ['POST'])
@db_session
def get_post_json_data():
    js_data = request.json
    logging.info('js_data: ')
    logging.info(js_data)
    logging.info(type(js_data))
    for key in js_data:
        logging.info('ID: ' + js_data[key])
        Messages[js_data[key]].delete()
    return 'get_post_json_data was successful'

@app.route('/message/<int:id>')
@db_session
def message(id):
    list = select (e for e in Messages if e.id == id)[:]
    record = Messages[id]
    return render_template('message.html', list=list)

if __name__ == "__main__":
    app.run(debug=True)


