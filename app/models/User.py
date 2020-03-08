"""
Created by ranml on 2019/1/28
"""
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String
from werkzeug.security import check_password_hash, generate_password_hash

from app import login_manager
from app.models.Base import Base

__author__ = 'ranml'


class User(UserMixin, Base):
    """
    继承 `UserMixin` 是 `Flask-Login` 要求的
    """
    id = Column(Integer, primary_key=True)
    nickname = Column(String(24), nullable=False)
    mobile = Column(String(18), unique=True)
    email = Column(String(50), unique=True, nullable=False)
    # password 为 表字段 的名字，实则为了解决赋值时直接将 password 赋值给模型（password字段不存在，所以无法赋值）,为了加密
    _password = Column('password', String(100), nullable=True)

    @property
    def password(self):
        """
        getter 函数
        读取 password 字段
        :return:
        """
        return self._password

    @password.setter
    def password(self, raw):
        """
        setter 函数
        解决明文存储 password 问题
        设置 password 字段
        :param raw:
        :return:
        """
        self._password = generate_password_hash(raw)

    def check_password(self, raw):
        """
        检测密码是否正确
        :param raw:
        :return:
        """
        return check_password_hash(self._password, raw)


@login_manager.user_loader
def get_user(uid):
    return User.query.get(uid)
