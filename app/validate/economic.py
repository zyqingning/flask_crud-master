"""
Created by 简单7月 on 2019-05-03
"""
from wtforms import Form, StringField, IntegerField
from wtforms.validators import DataRequired

__author = "简单7月"


class EconomicValidate(Form):
    city = StringField(validators=[DataRequired(message='城市必填')])
    type = IntegerField(validators=[DataRequired(message='类型不能为空')])
    sub_type = IntegerField(validators=[DataRequired(message='类型不能为空')])
