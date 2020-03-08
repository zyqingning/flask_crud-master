"""
Created by ranml on 2019/1/29
"""
from wtforms import StringField, Form, PasswordField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError

from app.models.User import User

__author__ = 'ranml'


class UserLoginForm(Form):
    """
    用户登录
    """
    email = StringField(validators=[DataRequired(message='邮箱必填'),
                                    Length(6, 64, message='请输入合法邮箱'),
                                    Email(message="请输入合法的邮箱")])

    password = PasswordField(validators=[DataRequired(message='密码不能为空'),
                                         Length(6, 32, message='密码最少 6 位，最多 32 位')])


class UserRegisterForm(Form):
    """
    用户注册验证
    """
    email = StringField(validators=[DataRequired(message='邮箱必填'),
                                    Length(6, 64, message='请输入合法邮箱'),
                                    Email(message="请输入合法的邮箱")])

    password = PasswordField(validators=[DataRequired(message='密码不能为空'),
                                         Length(6, 32, message='密码最少 6 位，最多 32 位')])

    password_confirmed = PasswordField(validators=[EqualTo('password', message='两次密码不一样')])

    nickname = StringField(validators=[DataRequired(message='昵称必填'),
                                       Length(2, 10, message='昵称最少 2 个字符，最多 10 个字符')])

    def validate_email(self, field):
        """
        验证邮箱，以 `validate_` 开头的字段， `wtforms`会自动识别，并进行验证
        :param field:
        :return:
        """
        if User.query.filter_by(email=field.data).first():
            raise ValidationError("邮箱已经注册")

    def validate_nickname(self, field):
        """
        验证昵称
        :param field:
        :return:
        """
        if User.query.filter_by(nickname=field.data).first():
            raise ValidationError("昵称已经存在")
