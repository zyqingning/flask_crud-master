from sqlalchemy import Column, Integer,String,VARCHAR
from sqlalchemy.orm import relationship, backref

from app.models.Base import Base

__author__ = "简单7月"


from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Boolean, SmallInteger


class Economic(Base):
    """
    经济数据表，与 EconomicData 是一对多的关系
    """
    id = Column(Integer, primary_key=True)
    type = Column(SmallInteger, default=0, nullable=False, comment="类型，如地区生产总值-1、固定资产投资-2等")
    name = Column(String(50), default='', nullable=False, comment="类型名称：如地区生产总值")
    sub_type = Column(SmallInteger, default=0, nullable=False, comment="子类型，如：type=1，sub_type=1，即为地区生产总值下的第一产业")
    sub_name = Column(String(50), default='', nullable=False, comment="子类型名字，如GDP、第一产业等")
    city = Column(String(20), default='', comment="城市名字")
    data = relationship("EconomicData", backref=backref('economic_data', uselist=False))

    def to_json(self):

        dict = self.__dict__
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
        return dict

    def __getitem__(self, item):
        return getattr(self, item)

    def keys(self):
        return ['id', 'name', 'sub_mame', 'city']


class EconomicData(Base):
    """
    经济数据存储的地方
    """
    id = Column(Integer, primary_key=True)
    total_data = Column(String(10), default=0.0, comment='经济值，以万亿为单位')
    date = Column(String(20), comment='时间，用于记录第几月份')
    is_quarter = Column(Boolean, default=0, comment='是否是季度数据，是-1，否-0')
    economic_id = Column(Integer, ForeignKey('economic.id'), comment='外键')