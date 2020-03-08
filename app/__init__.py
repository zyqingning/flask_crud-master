"""
Created by 简单7月 on 2019/1/28
"""

from flask_login import LoginManager

from .app import Flask
from app.models.Base import db

__author__ = '简单7月'

login_manager = LoginManager()


def create_app():
    """
    创建 app
    :return:
    """
    app = Flask(__name__)
    # 加载配置文件，定义在 config 目录下
    app.config.from_object('config.app')
    # 数据库配置
    app.config.from_object('config.database')

    # 注册蓝图
    register_blueprint(app)

    # 数据库初始化
    db.init_app(app)
    with app.app_context():
        # 创建数据表，sqlalchemy 会自己给我创建，记得在 config/database.py 中配置好数据库（这用的是 flask-sqlalchemy，它是 flask 的定制版本）
        db.create_all(app=app)

    # login manager
    login_manager.init_app(app)
    login_manager.login_view = 'web.login'
    login_manager.login_message = '请先登录或者注册'

    return app


def register_blueprint(app):
    """
    注册蓝图
    :param app:
    :return:
    """
    from app.web import web
    app.register_blueprint(web)


