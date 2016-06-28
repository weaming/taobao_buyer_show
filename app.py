# coding: utf-8
from __future__ import print_function, unicode_literals, with_statement, absolute_import, division

import json
from flask import Flask, request, make_response, render_template, jsonify
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/api/buyershow', methods=['POST', 'GET'])
def buyershow():
    if request.method == 'GET':
        return "GET method not allowed."

    if request.method == 'POST':
        form = request.form
        data = form.get('data', '')
        #print(data)
        rt = {
            'status': 'success'
        }
        #resp = make_response(json.dumps(rt, ensure_ascii=False), 200)
        resp = jsonify(rt)
        resp.headers["Access-Control-Allow-Origin"] = '*'
        return resp

@app.route('/api/buyershow', methods=['GET'])
def hot():
    if request.method == 'GET':
        resp = ""
        return resp

if __name__ == '__main__':
    host = '0.0.0.0'
    app.debug = True
    app.run(host)