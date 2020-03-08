from sqlalchemy import Column, Integer,String,VARCHAR

from app.models.Base import Base


class City(Base):
    id = Column(Integer(11), primary_key=True)
    city_name = Column(VARCHAR(24), nullable=False)
    pid = Column(Integer(11), nullable=False)
    deep = Column(Integer(2), nullable=False)
    pinyin = Column(VARCHAR(100),nullable=False)
    ext_id = Column(Integer(10), nullable=False)
    ext_name = Column(VARCHAR(100), nullable=False)
