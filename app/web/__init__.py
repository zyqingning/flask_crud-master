"""
Created by 简单7月 on 2019/1/28
"""
from flask import Blueprint

__author__ = '简单7月'

# 定义蓝图
web = Blueprint('web', __name__)

# 这里导入是 app/web 下的视图（类似于控制器）C
from app.web import user
from app.web import index

from app.web import news
from app.web import economic
