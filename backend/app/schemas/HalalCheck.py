from typing import Optional

from sqlmodel import Field, SQLModel


class ecodes(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ecode: str = Field(index=True)
    ingredient_name: str = Field(index=True)
    category: str = Field(index=True)
    id_status: int = Field(index=True)
    desc: str = Field(index=True)


class the_status(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    status_nm: str = Field(index=True)

class ingredient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ecode: str = Field(index=True)
    ingredient_name: str = Field(index=True)
    id_status: int = Field(index=True)
    desc: str = Field(index=True)