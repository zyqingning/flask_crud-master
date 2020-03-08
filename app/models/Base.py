"""
Created by 简单7月 on 2019/1/28
"""
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

__author__ = 'ranml'

# from flask_
db = SQLAlchemy()


class Base(db.Model):
    __abstract__ = True

    # 公共字段 --> 继承了 Base 的模型都会创建一下字段
    # 创建时间
    created_at = db.Column(db.DateTime, default=datetime.now)
    # 更新时间
    updated_at = db.Column(db.DateTime, default=datetime.now())
    # 状态，用于软删除
    status = db.Column(db.SmallInteger, default=1)

    def set_attrs(self, params):
        """
        设置属性，将 params 赋值给模型的字段
        :param params: 参数，dict
        :return:
        """
        for k, v in params.items():
            if hasattr(self, k) and k != 'id':
                setattr(self, k, v)

