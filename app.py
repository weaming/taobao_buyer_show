# coding: utf-8
from __future__ import print_function, unicode_literals, with_statement, absolute_import, division

import json
from flask import Flask, request, make_response, render_template, jsonify
import redis

app = Flask(__name__)
r = redis.Redis(host='192.168.22.158',port=6379,db=0)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/api/buyershow', methods=['POST', 'GET'])
def buyershow():
    if request.method == 'GET':
        _redis_keys = r.keys()[:10]
        print(_redis_keys)
        rt = {"data":[
            {
                "url": "https://img.alicdn.com/imgextra/i1/127950229301106397/TB2hMw1pFXXXXXjXpXXXXXXXXXX_!!0-rate.jpg_400x400.jpg",
                "content": "ssss"
            },
        ]}
        resp = jsonify(rt)
        resp.headers["Access-Control-Allow-Origin"] = '*'
        return resp

    if request.method == 'POST':
        form = request.form
        data = form.get('data', '')
        #print(data)
        __data = json.loads(data)
        db_result = r.set('buyershow:id:%s:page:%s' % (__data['id'], __data['data']['currentPageNum']), data)
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