"""
Created by 简单7月 on 2019/1/28
"""
from flask import render_template

from . import web

__author__ = '简单7月'


@web.route('/')
def index():
    return render_template('index.html')
