# coding: utf-8
from __future__ import print_function, unicode_literals, with_statement, absolute_import, division

import json, random, traceback
from flask import Flask, request, make_response, render_template, jsonify
import redis

app = Flask(__name__)
app.debug = False
redis_host = '127.0.0.1'
if app.debug:
    redis_host = '192.168.123.250'
r = redis.Redis(host=redis_host,port=6379,db=0)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/api/buyershow', methods=['POST', 'GET'])
def buyershow():
    if request.method == 'GET':
        rt = None
        _redis_keys = [r.srandmember('buyershow:ids') for i in xrange(20)]
        _redis_keys = set(_redis_keys)
        data_id = list(_redis_keys)[:5*2]
        try:
            values = filter(None, [r.get('buyershow:id:%s:page:1' % id) for id in data_id])
            objs = [json.loads(value) for value in values]
            data_title = [obj.get('title', '') or '' for obj in objs]
            data_url = ['?id={}&t={}'.format(id, title) for id,title in zip(data_id, data_title)]
            data_img = [obj['data']['comments'][0]['photos'][0]['url'] for obj in objs]
            __data = dict(zip(data_url, zip(data_img, data_title)))
        except:
            log = traceback.format_exc()
            rt = {'status': 'fail', 'log': log}

        rt = rt or {
            'status': 'success',
            'len': len(data_id),
            'data': __data
        }
        resp = jsonify(rt)
        resp.headers["Access-Control-Allow-Origin"] = '*'
        return resp

    if request.method == 'POST':
        form = request.form
        data = form.get('data', '')
        __data = json.loads(data)
        db_page = r.set('buyershow:id:%s:page:%s' % (__data['id'], __data['data']['currentPageNum']), data)
        db_ids = r.sadd('buyershow:ids', __data['id'])
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
    host = '127.0.0.1'
    port = 8004
    if app.debug:
        host = '0.0.0.0'
        port = 5000
    app.run(host, port)
