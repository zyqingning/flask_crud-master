from sqlalchemy import Column, Integer,String,VARCHAR

from app.models.Base import Base

class Economic(Base):
    id = Column(Integer(11), primary_key=True)
    eco_name = Column(VARCHAR(24), nullable=False)
    eco_unit = Column(VARCHAR(10),nullable=False)
    city_id = Column(Integer(11), primary_key=False)
    data = Column(Integer(20),nullable=False)













































